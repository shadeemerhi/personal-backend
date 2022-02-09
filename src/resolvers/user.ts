import { FileUpload, GraphQLUpload } from "graphql-upload";
import { isAuth } from "../middleware/isAuth";
import { uploadFile } from "../util/s3";
import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { User, UserModel } from "../entities/User";
import { v4 } from "uuid";

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
}

@Resolver()
export class UserResolver {
  @Query(() => User)
  async user(): Promise<User | null> {
    return await UserModel.findOne({ email: "shadmerhi@gmail.com" });
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
  async updateUser(@Arg("input") input: UpdateUserInput): Promise<User | null> {
    const { email, photoFile } = input;

    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        throw new Error("Error finding user");
      }

      if (photoFile) {
        await uploadFile(photoFile, user.s3Key);
      }

      return await UserModel.findOneAndUpdate({ email }, input, { new: true });
    } catch (error) {
      throw new Error("Failed to update the user");
    }
  }
}
