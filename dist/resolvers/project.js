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
exports.ProjectResolver = void 0;
const graphql_upload_1 = require("graphql-upload");
const type_graphql_1 = require("type-graphql");
const uuid_1 = require("uuid");
const project_1 = require("../entities/project");
const isAuth_1 = require("../middleware/isAuth");
const s3_1 = require("../util/s3");
let NewProjectInput = class NewProjectInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], NewProjectInput.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], NewProjectInput.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_upload_1.GraphQLUpload),
    __metadata("design:type", Object)
], NewProjectInput.prototype, "photoFile", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Date)
], NewProjectInput.prototype, "startDate", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], NewProjectInput.prototype, "endDate", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], NewProjectInput.prototype, "repositoryLinks", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => project_1.StackScalar),
    __metadata("design:type", Object)
], NewProjectInput.prototype, "stack", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean),
    __metadata("design:type", Boolean)
], NewProjectInput.prototype, "inProgress", void 0);
NewProjectInput = __decorate([
    (0, type_graphql_1.InputType)()
], NewProjectInput);
let UpdateProjectInput = class UpdateProjectInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UpdateProjectInput.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UpdateProjectInput.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UpdateProjectInput.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_upload_1.GraphQLUpload, { nullable: true }),
    __metadata("design:type", Object)
], UpdateProjectInput.prototype, "photoFile", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UpdateProjectInput.prototype, "photoURL", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Date)
], UpdateProjectInput.prototype, "startDate", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], UpdateProjectInput.prototype, "endDate", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], UpdateProjectInput.prototype, "repositoryLinks", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => project_1.StackScalar),
    __metadata("design:type", Object)
], UpdateProjectInput.prototype, "stack", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean),
    __metadata("design:type", Boolean)
], UpdateProjectInput.prototype, "inProgress", void 0);
UpdateProjectInput = __decorate([
    (0, type_graphql_1.InputType)()
], UpdateProjectInput);
let ProjectResolver = class ProjectResolver {
    async project(id) {
        return await project_1.ProjectModel.findOne({ id });
    }
    async projects() {
        return await project_1.ProjectModel.find();
    }
    async createProject(input, adminKey) {
        const { title, description, photoFile, startDate, stack, endDate, inProgress, repositoryLinks, } = input;
        if (!(0, isAuth_1.isAuth)(adminKey)) {
            throw new Error("Not authorized");
        }
        try {
            const s3Result = await (0, s3_1.uploadFile)(photoFile);
            const { Location, Key } = s3Result;
            console.log("HERE IS RESULT", s3Result);
            return await project_1.ProjectModel.create({
                _id: (0, uuid_1.v4)(),
                title,
                photoURL: Location,
                s3Key: Key,
                description,
                startDate,
                endDate,
                inProgress,
                repositoryLinks,
                stack,
            });
        }
        catch (error) {
            console.log("s3 error lol", error);
            throw new Error("Failed to upload image");
        }
    }
    async updateProject(input, adminKey) {
        const { _id, photoFile, endDate } = input;
        if (!(0, isAuth_1.isAuth)(adminKey)) {
            throw new Error("Not authorized");
        }
        try {
            const project = await project_1.ProjectModel.findById({ _id });
            if (!project) {
                throw new Error("Project not found");
            }
            if (photoFile) {
                await (0, s3_1.uploadFile)(photoFile, project.s3Key);
                delete input.photoFile;
            }
            return await project_1.ProjectModel.findOneAndUpdate({ _id }, Object.assign(Object.assign({}, input), { endDate: endDate ? endDate : null }), { new: true });
        }
        catch (error) {
            throw new Error("Failed to update project");
        }
    }
    async deleteProject(_id, adminKey) {
        if (!(0, isAuth_1.isAuth)(adminKey)) {
            throw new Error("Not authorized");
        }
        try {
            const project = await project_1.ProjectModel.findById({ _id });
            if (!project) {
                throw new Error("Project not found");
            }
            await (0, s3_1.deleteFile)(project.s3Key);
            await project_1.ProjectModel.deleteOne({ _id });
            return true;
        }
        catch (error) {
            throw new Error("Error deleting post");
        }
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => project_1.Project),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectResolver.prototype, "project", null);
__decorate([
    (0, type_graphql_1.Query)(() => [project_1.Project]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProjectResolver.prototype, "projects", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => project_1.Project),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.Arg)("adminKey")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [NewProjectInput, String]),
    __metadata("design:returntype", Promise)
], ProjectResolver.prototype, "createProject", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => project_1.Project),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.Arg)("adminKey")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UpdateProjectInput, String]),
    __metadata("design:returntype", Promise)
], ProjectResolver.prototype, "updateProject", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("_id")),
    __param(1, (0, type_graphql_1.Arg)("adminKey")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProjectResolver.prototype, "deleteProject", null);
ProjectResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], ProjectResolver);
exports.ProjectResolver = ProjectResolver;
//# sourceMappingURL=project.js.map