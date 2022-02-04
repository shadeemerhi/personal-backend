import { ObjectId, PromiseProvider } from "mongoose";
import { getModelForClass, prop } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { GraphQLScalarType } from "graphql";
import { type } from "os";

export const StackScalar = new GraphQLScalarType({
  name: "Stack",
  description: "A project tech stack",

  // Don't fully understand this - will come back to it
  //   serialize: (value: unknown): Stack => {
  //     if (!(value instanceof Object)) {
  //       throw new Error();
  //     }
  //     if (!Object.keys(value).includes("orange")) {
  //       throw new Error("Stack must contain a frontend");
  //     }
  //     return value;
  //   },
});

export type Stack = {
  frontend: string[];
  backend: string[];
  other: string[];
};

@ObjectType()
export class Project extends TimeStamps {
  @Field(() => String)
  @prop()
  readonly _id: string;

  @Field(() => String)
  @prop({ required: true })
  title!: string;

  @Field(() => String)
  @prop({ required: true })
  photoURL!: string;

  @Field(() => String)
  @prop({ required: true })
  description!: string;

  @Field(() => Date)
  @prop({ required: true })
  startDate!: Date;

  @Field(() => Date, { nullable: true })
  @prop()
  endDate!: Date | null;

  @Field(() => Boolean)
  @prop({ required: true })
  inProgress!: boolean;

  @Field(() => [String])
  @prop({ required: true })
  repositoryLinks!: string[];

  @Field(() => StackScalar)
  @prop({ required: true })
  stack!: Stack;

  @prop()
  createdAt: Date;

  @prop()
  updatedAt: Date;
}

export const ProjectModel = getModelForClass(Project);
