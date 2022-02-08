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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectModel = exports.Project = exports.StackScalar = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const type_graphql_1 = require("type-graphql");
const defaultClasses_1 = require("@typegoose/typegoose/lib/defaultClasses");
const graphql_1 = require("graphql");
exports.StackScalar = new graphql_1.GraphQLScalarType({
    name: "Stack",
    description: "A project tech stack",
});
let Project = class Project extends defaultClasses_1.TimeStamps {
};
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Project.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Project.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Project.prototype, "photoURL", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Project.prototype, "s3Key", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Project.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Date),
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Date)
], Project.prototype, "startDate", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Date, { nullable: true }),
    (0, typegoose_1.prop)(),
    __metadata("design:type", Object)
], Project.prototype, "endDate", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean),
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Boolean)
], Project.prototype, "inProgress", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String]),
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Array)
], Project.prototype, "repositoryLinks", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => exports.StackScalar),
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Object)
], Project.prototype, "stack", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Date)
], Project.prototype, "createdAt", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Date)
], Project.prototype, "updatedAt", void 0);
Project = __decorate([
    (0, type_graphql_1.ObjectType)()
], Project);
exports.Project = Project;
exports.ProjectModel = (0, typegoose_1.getModelForClass)(Project);
//# sourceMappingURL=project.js.map