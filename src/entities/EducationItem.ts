import { getModelForClass, prop } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class EducationItem extends TimeStamps {
  @Field(() => String, { nullable: true })
  @prop()
  readonly _id: string;

  @Field(() => String)
  @prop({ required: true })
  schoolName: string;

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
}

export const EducationItemModel = getModelForClass(EducationItem);
