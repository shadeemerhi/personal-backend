import { EducationItem, EducationItemModel } from "../entities/EducationItem";
import {
  Arg,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import { v4 } from "uuid";

@InputType()
class EducationItemInput {
  @Field(() => String, { nullable: true })
  _id?: string;

  @Field(() => String)
  schoolName: string;

  @Field(() => String)
  title: string;

  @Field(() => Date)
  startDate: Date;

  @Field(() => Date, { nullable: true })
  endDate: Date | null;

  @Field(() => Boolean)
  inProgress: boolean;
}

@Resolver()
export class EducationItemResolver {
  @Query(() => [EducationItem])
  async educationItems(): Promise<EducationItem[]> {
    return await EducationItemModel.find();
  }

  @Mutation(() => EducationItem)
  async createEducationItem(
    @Arg("input") input: EducationItemInput,
    @Arg("adminKey") adminKey: string
  ): Promise<EducationItem> {
    if (!isAuth(adminKey)) {
      throw new Error("Not authorized");
    }

    try {
      return await EducationItemModel.create({
        _id: v4(),
        ...input,
      });
    } catch (error) {
      throw new Error("Failed to create education item");
    }
  }

  @Mutation(() => EducationItem)
  async updateEducationItem(
    @Arg("input") input: EducationItemInput,
    @Arg("adminKey") adminKey: string
  ) {
    if (!isAuth(adminKey)) {
      throw new Error("Not authorized");
    }

    try {
      const { _id, endDate } = input;
      return await EducationItemModel.findOneAndUpdate(
        { _id },
        { ...input, endDate: endDate ? endDate : null },
        { new: true }
      );
    } catch (error) {
      throw new Error("Failed to update education item");
    }
  }

  @Mutation(() => Boolean)
  async deleteEducationItem(
    @Arg("_id") _id: string,
    @Arg("adminKey") adminKey: string
  ) {
    if (!isAuth(adminKey)) {
      throw new Error("Not authorized");
    }
    try {
      await EducationItemModel.deleteOne({ _id });
      return true;
    } catch (error) {
      throw new Error("Error deleting education item");
    }
  }
}
