import { getModelForClass, prop } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class User extends TimeStamps {
  @Field()
  @prop()
  readonly _id: string;

  @Field(() => String)
  @prop({ required: true })
  title!: string;

  @Field(() => String)
  @prop({ required: true })
  photoURL!: string;

  @Field()
  @prop({ required: true })
  s3Key!: string;

  @Field(() => String)
  @prop({ required: true })
  githubLink!: string;

  @Field(() => String)
  @prop({ required: true })
  linkedInLink!: string;

  @Field(() => String)
  @prop({ required: true })
  email!: string;

  @Field(() => String)
  @prop({ required: true })
  preBio!: string;

  @Field(() => String)
  @prop({ required: true })
  bio!: string;

  @Field(() => String)
  updatedAt: Date;
}

export const UserModel = getModelForClass(User);
