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
exports.WorkItemResolver = void 0;
const WorkItem_1 = require("../entities/WorkItem");
const type_graphql_1 = require("type-graphql");
const isAuth_1 = require("../middleware/isAuth");
const uuid_1 = require("uuid");
let WorkItemInput = class WorkItemInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], WorkItemInput.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], WorkItemInput.prototype, "companyName", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], WorkItemInput.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Date),
    __metadata("design:type", Date)
], WorkItemInput.prototype, "startDate", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Date, { nullable: true }),
    __metadata("design:type", Object)
], WorkItemInput.prototype, "endDate", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean),
    __metadata("design:type", Boolean)
], WorkItemInput.prototype, "inProgress", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], WorkItemInput.prototype, "location", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], WorkItemInput.prototype, "description", void 0);
WorkItemInput = __decorate([
    (0, type_graphql_1.InputType)()
], WorkItemInput);
let WorkItemResolver = class WorkItemResolver {
    async workItems() {
        return await WorkItem_1.WorkItemModel.find();
    }
    async indicateItems() {
        return true;
    }
    async createWorkItem(input, adminKey) {
        if (!(0, isAuth_1.isAuth)(adminKey)) {
            throw new Error("Not authorized");
        }
        try {
            return await WorkItem_1.WorkItemModel.create(Object.assign({ _id: (0, uuid_1.v4)() }, input));
        }
        catch (error) {
            console.log(error);
            throw new Error("Failed to create work item");
        }
    }
    async updateWorkItem(input, adminKey) {
        if (!(0, isAuth_1.isAuth)(adminKey)) {
            throw new Error("Not authorized");
        }
        const { _id, endDate } = input;
        try {
            return await WorkItem_1.WorkItemModel.findOneAndUpdate({ _id }, Object.assign(Object.assign({}, input), { endDate: endDate ? endDate : null }), { new: true });
        }
        catch (error) {
            throw new Error("Failed to update work item");
        }
    }
    async deleteWorkItem(_id, adminKey) {
        if (!(0, isAuth_1.isAuth)(adminKey)) {
            throw new Error("Not authorized");
        }
        try {
            await WorkItem_1.WorkItemModel.deleteOne({ _id });
            return true;
        }
        catch (error) {
            throw new Error("Error deleting work item");
        }
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [WorkItem_1.WorkItem]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WorkItemResolver.prototype, "workItems", null);
__decorate([
    (0, type_graphql_1.Query)(() => Boolean),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WorkItemResolver.prototype, "indicateItems", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => WorkItem_1.WorkItem),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.Arg)("adminKey")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WorkItemInput, String]),
    __metadata("design:returntype", Promise)
], WorkItemResolver.prototype, "createWorkItem", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => WorkItem_1.WorkItem),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.Arg)("adminKey")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WorkItemInput, String]),
    __metadata("design:returntype", Promise)
], WorkItemResolver.prototype, "updateWorkItem", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("_id")),
    __param(1, (0, type_graphql_1.Arg)("adminKey")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], WorkItemResolver.prototype, "deleteWorkItem", null);
WorkItemResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], WorkItemResolver);
exports.WorkItemResolver = WorkItemResolver;
//# sourceMappingURL=workItem.js.map