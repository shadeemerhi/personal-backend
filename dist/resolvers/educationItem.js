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
exports.EducationItemResolver = void 0;
const EducationItem_1 = require("../entities/EducationItem");
const type_graphql_1 = require("type-graphql");
const isAuth_1 = require("../middleware/isAuth");
const uuid_1 = require("uuid");
let EducationItemInput = class EducationItemInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], EducationItemInput.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], EducationItemInput.prototype, "schoolName", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], EducationItemInput.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Date),
    __metadata("design:type", Date)
], EducationItemInput.prototype, "startDate", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Date, { nullable: true }),
    __metadata("design:type", Object)
], EducationItemInput.prototype, "endDate", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean),
    __metadata("design:type", Boolean)
], EducationItemInput.prototype, "inProgress", void 0);
EducationItemInput = __decorate([
    (0, type_graphql_1.InputType)()
], EducationItemInput);
let EducationItemResolver = class EducationItemResolver {
    async educationItems() {
        return await EducationItem_1.EducationItemModel.find();
    }
    async createEducationItem(input, adminKey) {
        if (!(0, isAuth_1.isAuth)(adminKey)) {
            throw new Error("Not authorized");
        }
        try {
            return await EducationItem_1.EducationItemModel.create(Object.assign({ _id: (0, uuid_1.v4)() }, input));
        }
        catch (error) {
            throw new Error("Failed to create education item");
        }
    }
    async updateEducationItem(input, adminKey) {
        if (!(0, isAuth_1.isAuth)(adminKey)) {
            throw new Error("Not authorized");
        }
        try {
            const { _id, endDate } = input;
            return await EducationItem_1.EducationItemModel.findOneAndUpdate({ _id }, Object.assign(Object.assign({}, input), { endDate: endDate ? endDate : null }), { new: true });
        }
        catch (error) {
            throw new Error("Failed to update education item");
        }
    }
    async deleteEducationItem(_id, adminKey) {
        if (!(0, isAuth_1.isAuth)(adminKey)) {
            throw new Error("Not authorized");
        }
        try {
            await EducationItem_1.EducationItemModel.deleteOne({ _id });
            return true;
        }
        catch (error) {
            throw new Error("Error deleting education item");
        }
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [EducationItem_1.EducationItem]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EducationItemResolver.prototype, "educationItems", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => EducationItem_1.EducationItem),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.Arg)("adminKey")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EducationItemInput, String]),
    __metadata("design:returntype", Promise)
], EducationItemResolver.prototype, "createEducationItem", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => EducationItem_1.EducationItem),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.Arg)("adminKey")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EducationItemInput, String]),
    __metadata("design:returntype", Promise)
], EducationItemResolver.prototype, "updateEducationItem", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("_id")),
    __param(1, (0, type_graphql_1.Arg)("adminKey")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EducationItemResolver.prototype, "deleteEducationItem", null);
EducationItemResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], EducationItemResolver);
exports.EducationItemResolver = EducationItemResolver;
//# sourceMappingURL=educationItem.js.map