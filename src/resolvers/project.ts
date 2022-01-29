import { ObjectType, Field, Resolver, Query, Int } from "type-graphql";

@Resolver()
export class ProjectResolver {

    @Query(() => String)
    test() {
        return "Hello from test shadee :)";
    }
}
