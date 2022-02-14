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
exports.EducationItemModel = exports.EducationItem = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const defaultClasses_1 = require("@typegoose/typegoose/lib/defaultClasses");
const type_graphql_1 = require("type-graphql");
let EducationItem = class EducationItem extends defaultClasses_1.TimeStamps {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], EducationItem.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], EducationItem.prototype, "schoolName", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], EducationItem.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Date),
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Date)
], EducationItem.prototype, "startDate", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Date, { nullable: true }),
    (0, typegoose_1.prop)(),
    __metadata("design:type", Object)
], EducationItem.prototype, "endDate", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean),
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Boolean)
], EducationItem.prototype, "inProgress", void 0);
EducationItem = __decorate([
    (0, type_graphql_1.ObjectType)()
], EducationItem);
exports.EducationItem = EducationItem;
exports.EducationItemModel = (0, typegoose_1.getModelForClass)(EducationItem);
//# sourceMappingURL=Education.js.map