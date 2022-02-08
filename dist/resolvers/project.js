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
const type_graphql_1 = require("type-graphql");
const uuid_1 = require("uuid");
const graphql_upload_1 = require("graphql-upload");
const project_1 = require("../entities/project");
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
], UpdateProjectInput.prototype, "id", void 0);
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
    async createProject(input) {
        const { title, description, photoFile, startDate, stack, endDate, inProgress, repositoryLinks, } = input;
        console.log("HERE IS INPUT", input);
        try {
            const s3Result = await (0, s3_1.uploadFile)(photoFile);
            const { Location } = s3Result;
            console.log("HERE IS RESULT", s3Result);
            return await project_1.ProjectModel.create({
                id: (0, uuid_1.v4)(),
                _id: (0, uuid_1.v4)(),
                title,
                photoURL: Location,
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
    async updateProject(input) {
        const { id, photoFile } = input;
        if (photoFile) {
        }
        console.log("HERE IS UPDATE ID", id);
        const project = await project_1.ProjectModel.findOne({ id });
        if (!project) {
            throw new Error("Project not found");
        }
        return await project_1.ProjectModel.findOneAndUpdate({ id }, input, { new: true });
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [NewProjectInput]),
    __metadata("design:returntype", Promise)
], ProjectResolver.prototype, "createProject", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => project_1.Project),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UpdateProjectInput]),
    __metadata("design:returntype", Promise)
], ProjectResolver.prototype, "updateProject", null);
ProjectResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], ProjectResolver);
exports.ProjectResolver = ProjectResolver;
//# sourceMappingURL=project.js.map