import "reflect-metadata";
import "dotenv/config";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import cors from "cors";
import { buildSchema } from "type-graphql";
import { ProjectResolver } from "./resolvers/project";
import connectDB from "./config/db.js";
import { graphqlUploadExpress } from "graphql-upload";
import { MyContext } from "./types";
import { UserResolver } from "./resolvers/user";

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
      resolvers: [ProjectResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({
      adminPasskey: process.env.ADMIN_PASSKEY as string,
      req,
      res
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
