import {
  ObjectType,
  Field,
  Resolver,
  Query,
  Int,
  Arg,
  Mutation,
  InputType,
} from "type-graphql";

import { v4 } from "uuid";

import { GraphQLUpload, FileUpload } from "graphql-upload";

import { Project, ProjectModel, Stack, StackScalar } from "../entities/project";
import { createWriteStream } from "fs";
import { sleep } from "../util/sleep";
import { uploadFile } from "../util/s3";

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
  photoFile: FileUpload;

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
    } = input;
    console.log("HERE IS INPUT", input);

    try {
      const s3Result = await uploadFile(photoFile);
      const { Location } = s3Result;
      console.log("HERE IS RESULT", s3Result);
      return await ProjectModel.create({
        _id: v4(),
        title,
        photoURL: Location,
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
    const { _id, photoFile } = input;
    if (photoFile) {
      // logic to update photo in s3
    }

    const project = await ProjectModel.findById({ _id });

    // Should never happen
    if (!project) {
      throw new Error("Project not found");
    }

    return await ProjectModel.findOneAndUpdate({ _id }, input, { new: true });
  }
}
