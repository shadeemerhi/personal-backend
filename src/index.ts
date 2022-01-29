import "reflect-metadata";
import "dotenv/config";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import cors from "cors";
import { buildSchema } from "type-graphql";
import { ProjectResolver } from "./resolvers/project";
import connectDB from "./config/db.js";
import { ProjectModel } from "./entities/project";
import { v4 } from 'uuid';

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

    await connectDB();

    const { _id } = await ProjectModel.create({
        _id: v4(),
        title: "Shadee New Project",
    });

    app.listen(process.env.PORT, () => {
        console.log("Server started on PORT 4000");
    });
};

main().catch((err) => console.log(err));
