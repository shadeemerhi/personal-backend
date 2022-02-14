import { WorkItem, WorkItemModel } from "../entities/WorkItem";
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
class WorkItemInput {
  @Field(() => String, { nullable: true })
  _id?: string;

  @Field(() => String)
  companyName: string;

  @Field(() => String)
  title: string;

  @Field(() => Date)
  startDate: Date;

  @Field(() => Date, { nullable: true })
  endDate: Date | null;

  @Field(() => Boolean)
  inProgress: boolean;

  @Field(() => String)
  location: string;

  @Field(() => [String])
  description: string[];
}

@Resolver()
export class WorkItemResolver {
  @Query(() => [WorkItem])
  async workItems(): Promise<WorkItem[]> {
    return await WorkItemModel.find();
  }

  @Mutation(() => WorkItem)
  async createWorkItem(
    @Arg("input") input: WorkItemInput,
    @Arg("adminKey") adminKey: string
  ): Promise<WorkItem> {
    if (!isAuth(adminKey)) {
      throw new Error("Not authorized");
    }
    try {
      return await WorkItemModel.create({
        _id: v4(),
        ...input,
      });
    } catch (error) {
      console.log(error);
      throw new Error("Failed to create work item");
    }
  }

  @Mutation(() => WorkItem)
  async updateWorkItem(
    @Arg("input") input: WorkItemInput,
    @Arg("adminKey") adminKey: string
  ): Promise<WorkItem | null> {
    if (!isAuth(adminKey)) {
      throw new Error("Not authorized");
    }

    const { _id } = input;

    try {
      return await WorkItemModel.findOneAndUpdate(
        { _id },
        { ...input },
        { new: true }
      );
    } catch (error) {
      throw new Error("Failed to update work item");
    }
  }
}
