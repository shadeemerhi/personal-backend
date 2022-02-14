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
exports.EducationItemResolver = void 0;
const Education_1 = require("../entities/Education");
const type_graphql_1 = require("type-graphql");
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
        return await Education_1.EducationItemModel.find();
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [Education_1.EducationItem]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EducationItemResolver.prototype, "educationItems", null);
EducationItemResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], EducationItemResolver);
exports.EducationItemResolver = EducationItemResolver;
//# sourceMappingURL=education.js.map