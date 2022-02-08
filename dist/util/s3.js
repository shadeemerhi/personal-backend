"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.uploadFile = void 0;
const s3_1 = __importDefault(require("aws-sdk/clients/s3"));
const path_1 = require("path");
const uuid_1 = require("uuid");
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const s3 = new s3_1.default({
    region,
    accessKeyId,
    secretAccessKey,
});
const uploadFile = async (file, key) => {
    const { createReadStream, filename, mimetype, encoding } = await file;
    const fileStream = createReadStream();
    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: key ? key : `${(0, uuid_1.v4)()}${(0, path_1.extname)(filename)}`,
        ContentType: mimetype,
    };
    return s3.upload(uploadParams).promise();
};
exports.uploadFile = uploadFile;
const deleteFile = async (key) => {
    return s3
        .deleteObject({
        Bucket: bucketName,
        Key: key,
    })
        .promise();
};
exports.deleteFile = deleteFile;
//# sourceMappingURL=s3.js.map