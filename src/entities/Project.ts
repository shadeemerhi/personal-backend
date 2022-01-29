import { ObjectId } from "mongoose";
import { getModelForClass, prop } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Project {
    @Field(() => String)
    @prop()
    readonly _id: string;

    @Field(() => String)
    @prop()
    title!: string;
}

export const ProjectModel = getModelForClass(Project);
