import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import cors from "cors";
import { buildSchema } from "type-graphql";
import { ProjectResolver } from "./resolvers/project";

const main = async () => {
    const app = express();

    app.use(
        cors({
            origin: "http://localhost:3000",
            credentials: true,
        })
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [ProjectResolver],
            validate: false,
        }),
        context: ({}): any => ({}),
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({
        app,
        cors: false,
    });

    app.listen(4000, () => {
        console.log("Server started on PORT 4000");
    });
};

main().catch((err) => console.log(err));
