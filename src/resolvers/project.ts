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

import {} from ''

import { GraphQLUpload, FileUpload } from "graphql-upload";

import { Stream } from "stream";

import { Project, ProjectModel } from "../entities/project";
import { createWriteStream } from "fs";

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

  @Mutation(() => Boolean)
  async createProject(
    @Arg("file", () => GraphQLUpload) file: FileUpload,
    @Arg("name") name: string
  ): Promise<boolean> {
    console.log("HERE ARE THE ARGS", file, name);
    const { createReadStream, filename } = file;
    return new Promise(async (resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(__dirname + `/../../images/${filename}`))
        .on("finish", () => resolve(true))
        .on("error", (err) => {
            console.log(err);
            reject(false)
        })
    );
  }
}
