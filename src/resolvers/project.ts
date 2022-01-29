import { ObjectType, Field, Resolver, Query, Int } from "type-graphql";

import { Project, ProjectModel } from "../entities/project";

@Resolver()
export class ProjectResolver {
    @Query(() => Project)
    async test(): Promise<Project | null> {
        return await ProjectModel.findOne({ title: "Shadee New Project" });
    }
}
