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
}
