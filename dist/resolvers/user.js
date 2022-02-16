"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const graphql_upload_1 = require("graphql-upload");
const isAuth_1 = require("../middleware/isAuth");
const s3_1 = require("../util/s3");
const type_graphql_1 = require("type-graphql");
const User_1 = require("../entities/User");
const uuid_1 = require("uuid");
const project_1 = require("../entities/project");
let NewUserInput = class NewUserInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], NewUserInput.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_upload_1.GraphQLUpload),
    __metadata("design:type", Object)
], NewUserInput.prototype, "photoFile", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], NewUserInput.prototype, "githubLink", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], NewUserInput.prototype, "linkedInLink", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], NewUserInput.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], NewUserInput.prototype, "preBio", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], NewUserInput.prototype, "bio", void 0);
NewUserInput = __decorate([
    (0, type_graphql_1.InputType)()
], NewUserInput);
let UpdateUserInput = class UpdateUserInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UpdateUserInput.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UpdateUserInput.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_upload_1.GraphQLUpload, { nullable: true }),
    __metadata("design:type", Object)
], UpdateUserInput.prototype, "photoFile", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UpdateUserInput.prototype, "photoURL", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UpdateUserInput.prototype, "githubLink", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UpdateUserInput.prototype, "linkedInLink", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UpdateUserInput.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateUserInput.prototype, "preBio", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UpdateUserInput.prototype, "bio", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", Date)
], UpdateUserInput.prototype, "updatedAt", void 0);
UpdateUserInput = __decorate([
    (0, type_graphql_1.InputType)()
], UpdateUserInput);
let UserResponse = class UserResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], UserResponse.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => project_1.Project, { nullable: true }),
    __metadata("design:type", Object)
], UserResponse.prototype, "latestRelease", void 0);
UserResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], UserResponse);
let UserResolver = class UserResolver {
    async user(_id) {
        try {
            const user = await User_1.UserModel.findOne({ _id });
            if (!user) {
                throw new Error("Unable to find user");
            }
            let latestRelease;
            const sortedProjects = await project_1.ProjectModel.find().sort({ createdAt: -1 });
            latestRelease = sortedProjects[0];
            if (!latestRelease) {
                latestRelease = null;
            }
            return {
                user,
                latestRelease,
            };
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async createUser(input, adminKey) {
        if (!(0, isAuth_1.isAuth)(adminKey)) {
            throw new Error("Not authorized");
        }
        try {
            const s3Result = await (0, s3_1.uploadFile)(input.photoFile);
            const { Location, Key } = s3Result;
            console.log("HERE IS RESULT", s3Result);
            return await User_1.UserModel.create(Object.assign(Object.assign({ _id: (0, uuid_1.v4)() }, input), { photoURL: Location, s3Key: Key }));
        }
        catch (error) {
            throw new Error("Failed to update the user");
        }
    }
    async updateUser(input, adminKey) {
        if (!(0, isAuth_1.isAuth)(adminKey)) {
            throw new Error("Not authorized");
        }
        const { _id, photoFile } = input;
        try {
            const user = await User_1.UserModel.findOne({ _id });
            if (!user) {
                throw new Error("Error finding user");
            }
            if (photoFile) {
                await (0, s3_1.uploadFile)(photoFile, user.s3Key);
            }
            return await User_1.UserModel.findOneAndUpdate({ _id }, input, { new: true });
        }
        catch (error) {
            throw new Error("Failed to update the user");
        }
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "user", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => User_1.User),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.Arg)("adminKey")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [NewUserInput, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "createUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => User_1.User),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.Arg)("adminKey")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UpdateUserInput, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "updateUser", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map