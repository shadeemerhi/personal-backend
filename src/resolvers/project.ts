import { ObjectType, Field, Resolver, Query, Int, Arg } from "type-graphql";

import { Project, ProjectModel } from "../entities/project";

@Resolver()
export class ProjectResolver {
    @Query(() => Project)
    async project(@Arg('id') id: string
    ): Promise<Project | null> {
        return await ProjectModel.findOne({ id });
    }

    @Query(() => [Project])
    async projects(): Promise<Project[] | null> {
        return await ProjectModel.find();
    }
}
