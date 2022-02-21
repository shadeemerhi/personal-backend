import { FileUpload, GraphQLUpload } from "graphql-upload";
import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { v4 } from "uuid";
import { Project, ProjectModel, Stack, StackScalar } from "../entities/project";
import { isAuth } from "../middleware/isAuth";
import { deleteFile, uploadFile } from "../util/s3";

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
}

@Resolver()
export class ProjectResolver {
  @Query(() => Project)
  async project(@Arg("id") id: string): Promise<Project | null> {
    return await ProjectModel.findOne({ id });
  }

  @Query(() => [Project])
  async projects(): Promise<Project[] | null> {
    return await ProjectModel.find().sort({ createdAt: -1 });
  }

  @Mutation(() => Project)
  async createProject(
    @Arg("input") input: NewProjectInput,
    @Arg("adminKey") adminKey: string
  ): Promise<Project> {
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
    if (!isAuth(adminKey)) {
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
    @Arg("input") input: UpdateProjectInput,
    @Arg("adminKey") adminKey: string
  ): Promise<Project | null> {
    const { _id, photoFile, endDate } = input;

    if (!isAuth(adminKey)) {
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
      return await ProjectModel.findOneAndUpdate(
        { _id },
        { ...input, endDate: endDate ? endDate : null },
        { new: true }
      );
    } catch (error) {
      throw new Error("Failed to update project");
    }
  }

  @Mutation(() => Boolean)
  async deleteProject(
    @Arg("_id") _id: string,
    @Arg("adminKey") adminKey: string
  ) {
    if (!isAuth(adminKey)) {
      throw new Error("Not authorized");
    }

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
