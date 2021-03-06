import "reflect-metadata";
import "dotenv/config";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import cors from "cors";
import { buildSchema } from "type-graphql";
import connectDB from "./config/db.js";
import { graphqlUploadExpress } from "graphql-upload";

import { MyContext } from "./types";
import { ProjectResolver } from "./resolvers/project";
import { UserResolver } from "./resolvers/user";
import { WorkItemResolver } from "./resolvers/workItem";
import { EducationItemResolver } from "./resolvers/educationItem";

const main = async () => {
  const app = express();

  app.use(
    cors({
      // origin: process.env.CORS_ORIGIN,
      origin: true,
      credentials: true,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        ProjectResolver,
        UserResolver,
        WorkItemResolver,
        EducationItemResolver,
      ],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({
      adminPasskey: process.env.ADMIN_PASSKEY as string,
      req,
      res,
    }),
    uploads: false,
  });

  app.use(graphqlUploadExpress());

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  await connectDB();

  app.listen(process.env.PORT, () => {
    console.log("Server started on PORT 4000");
  });
};

main().catch((err) => console.log(err));
