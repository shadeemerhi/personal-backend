import { getModelForClass, prop } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class WorkItem extends TimeStamps {
  @Field(() => String, { nullable: true })
  @prop()
  readonly _id: string;

  @Field(() => String)
  @prop({ required: true })
  companyName: string;

  @Field(() => String)
  @prop({ required: true })
  title: string;

  @Field(() => Date)
  @prop({ required: true })
  startDate: Date;

  @Field(() => Date, { nullable: true })
  @prop()
  endDate: Date | null;

  @Field(() => Boolean)
  @prop({ required: true })
  inProgress: boolean;

  @Field(() => String)
  @prop({ required: true })
  location: string;

  @Field(() => [String])
  @prop({ required: true })
  description: string[];
}

export const WorkItemModel = getModelForClass(WorkItem);
