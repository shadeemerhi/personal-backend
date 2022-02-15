"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv/config");
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const type_graphql_1 = require("type-graphql");
const db_js_1 = __importDefault(require("./config/db.js"));
const graphql_upload_1 = require("graphql-upload");
const project_1 = require("./resolvers/project");
const user_1 = require("./resolvers/user");
const workItem_1 = require("./resolvers/workItem");
const educationItem_1 = require("./resolvers/educationItem");
const main = async () => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [
                project_1.ProjectResolver,
                user_1.UserResolver,
                workItem_1.WorkItemResolver,
                educationItem_1.EducationItemResolver,
            ],
            validate: false,
        }),
        context: ({ req, res }) => ({
            adminPasskey: process.env.ADMIN_PASSKEY,
            req,
            res,
        }),
        uploads: false,
    });
    app.use((0, graphql_upload_1.graphqlUploadExpress)());
    await apolloServer.start();
    apolloServer.applyMiddleware({
        app,
        cors: false,
    });
    await (0, db_js_1.default)();
    app.listen(process.env.PORT, () => {
        console.log("Server started on PORT 4000");
    });
};
main().catch((err) => console.log(err));
//# sourceMappingURL=index.js.map