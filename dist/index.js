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
const project_1 = require("./resolvers/project");
const db_js_1 = __importDefault(require("./config/db.js"));
const main = async () => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: "http://localhost:3000",
        credentials: true,
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [project_1.ProjectResolver],
            validate: false,
        }),
        context: ({}) => ({}),
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({
        app,
        cors: false,
    });
    (0, db_js_1.default)();
    app.listen(process.env.PORT, () => {
        console.log("Server started on PORT 4000");
    });
};
main().catch((err) => console.log(err));
//# sourceMappingURL=index.js.map