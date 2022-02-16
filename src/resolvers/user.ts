import { FileUpload, GraphQLUpload } from "graphql-upload";
import { isAuth } from "../middleware/isAuth";
import { uploadFile } from "../util/s3";
import {
  Arg,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { User, UserModel } from "../entities/User";
import { v4 } from "uuid";
import { Project, ProjectModel } from "../entities/project";

@InputType()
class NewUserInput {
  @Field()
  title: string;

  @Field(() => GraphQLUpload)
  photoFile: FileUpload;

  @Field()
  githubLink: string;

  @Field()
  linkedInLink: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  preBio: string;

  @Field()
  bio: string;
}

@InputType()
class UpdateUserInput {
  @Field()
  _id: string;

  @Field()
  title: string;

  @Field(() => GraphQLUpload, { nullable: true })
  photoFile: FileUpload;

  @Field()
  photoURL: string;

  @Field()
  githubLink: string;

  @Field()
  linkedInLink: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  preBio: string;

  @Field()
  bio: string;

  @Field(() => String, { nullable: true })
  updatedAt: Date;
}

@ObjectType()
class UserResponse {
  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => Project, { nullable: true })
  latestRelease?: Project | null;
}

@Resolver()
export class UserResolver {
  @Query(() => UserResponse)
  async user(@Arg("_id") _id: string): Promise<UserResponse | null> {
    try {
      const user = await UserModel.findOne({ _id });

      if (!user) {
        throw new Error("Unable to find user");
      }

      let latestRelease;
      const sortedProjects = await ProjectModel.find().sort({ createdAt: -1 });
      latestRelease = sortedProjects[0];

      if (!latestRelease) {
        latestRelease = null;
      }

      return {
        user,
        latestRelease,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Mutation(() => User)
  async createUser(
    @Arg("input") input: NewUserInput,
    @Arg("adminKey") adminKey: string
  ): Promise<User | null> {
    if (!isAuth(adminKey)) {
      throw new Error("Not authorized");
    }

    try {
      const s3Result = await uploadFile(input.photoFile);
      const { Location, Key } = s3Result;
      console.log("HERE IS RESULT", s3Result);

      return await UserModel.create({
        _id: v4(),
        ...input,
        photoURL: Location,
        s3Key: Key,
      });
    } catch (error) {
      throw new Error("Failed to update the user");
    }
  }

  @Mutation(() => User)
  async updateUser(
    @Arg("input") input: UpdateUserInput,
    @Arg("adminKey") adminKey: string
  ): Promise<User | null> {
    if (!isAuth(adminKey)) {
      throw new Error("Not authorized");
    }

    const { _id, photoFile } = input;

    try {
      const user = await UserModel.findOne({ _id });

      if (!user) {
        throw new Error("Error finding user");
      }

      if (photoFile) {
        await uploadFile(photoFile, user.s3Key);
      }

      return await UserModel.findOneAndUpdate({ _id }, input, { new: true });
    } catch (error) {
      throw new Error("Failed to update the user");
    }
  }
}
