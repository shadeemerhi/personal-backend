import {
  ObjectType,
  Field,
  Resolver,
  Query,
  Int,
  Arg,
  Mutation,
  InputType,
  UseMiddleware,
} from "type-graphql";

import { v4 } from "uuid";

import { GraphQLUpload, FileUpload } from "graphql-upload";

import { Project, ProjectModel, Stack, StackScalar } from "../entities/project";
import { createWriteStream } from "fs";
import { sleep } from "../util/sleep";
import { deleteFile, uploadFile } from "../util/s3";
import { isAuth } from "../middleware/isAuth";

@InputType()
class NewProjectInput {
  @Field()
  title!: string;

  @Field()
  description!: string;

  @Field(() => GraphQLUpload)
  photoFile: FileUpload;

  @Field()
  startDate!: Date;

  @Field({ nullable: true })
  endDate: Date;

  @Field(() => [String])
  repositoryLinks!: string[];

  @Field(() => StackScalar)
  stack!: Stack;

  @Field(() => Boolean)
  inProgress!: boolean;

  @Field(() => String)
  adminPassKey: string;
}

@InputType()
class UpdateProjectInput {
  @Field()
  _id: string;

  @Field()
  title?: string;

  @Field()
  description?: string;

  @Field(() => GraphQLUpload, { nullable: true })
  photoFile?: FileUpload;

  @Field()
  photoURL: string;

  @Field()
  startDate?: Date;

  @Field({ nullable: true })
  endDate?: Date;

  @Field(() => [String])
  repositoryLinks?: string[];

  @Field(() => StackScalar)
  stack?: Stack;

  @Field(() => Boolean)
  inProgress?: boolean;

  @Field(() => String)
  adminPassKey?: string;
}

@Resolver()
export class ProjectResolver {
  @Query(() => Project)
  async project(@Arg("id") id: string): Promise<Project | null> {
    return await ProjectModel.findOne({ id });
  }

  @Query(() => [Project])
  async projects(): Promise<Project[] | null> {
    return await ProjectModel.find();
  }

  @Mutation(() => Project)
  async createProject(@Arg("input") input: NewProjectInput): Promise<Project> {
    const {
      title,
      description,
      photoFile,
      startDate,
      stack,
      endDate,
      inProgress,
      repositoryLinks,
      adminPassKey,
    } = input;
    console.log("HERE IS INPUT", input);
    if (!isAuth(adminPassKey)) {
      throw new Error("Not authorized");
    }

    try {
      const s3Result = await uploadFile(photoFile);
      const { Location, Key } = s3Result;
      console.log("HERE IS RESULT", s3Result);
      return await ProjectModel.create({
        _id: v4(),
        title,
        photoURL: Location,
        s3Key: Key,
        description,
        startDate,
        endDate,
        inProgress,
        repositoryLinks,
        stack,
      });
    } catch (error) {
      console.log("s3 error lol", error);
      throw new Error("Failed to upload image");
    }
  }

  @Mutation(() => Project)
  async updateProject(
    @Arg("input") input: UpdateProjectInput
  ): Promise<Project | null> {
    const { _id, photoFile, adminPassKey } = input;

    if (!isAuth(adminPassKey as string)) {
      throw new Error("Not authorized");
    }

    try {
      const project = await ProjectModel.findById({ _id });

      // Should never happen
      if (!project) {
        throw new Error("Project not found");
      }

      if (photoFile) {
        await uploadFile(photoFile, project.s3Key);
        delete input.photoFile;
      }
      return await ProjectModel.findOneAndUpdate({ _id }, input, { new: true });
    } catch (error) {
      throw new Error("Failed to update project");
    }
  }

  @Mutation(() => Boolean)
  async deleteProject(@Arg("_id") _id: string, secretKey: string) {
    try {
      const project = await ProjectModel.findById({ _id });

      // Should never happen
      if (!project) {
        throw new Error("Project not found");
      }
      await deleteFile(project.s3Key);
      await ProjectModel.deleteOne({ _id });
      return true;
    } catch (error) {
      throw new Error("Error deleting post");
    }
  }
}
