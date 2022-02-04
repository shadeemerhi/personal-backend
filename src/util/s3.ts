import S3, { PutObjectRequest } from "aws-sdk/clients/s3";
import fs from "fs";
import { FileUpload } from "graphql-upload";
import { extname } from "path";
import { v4 } from "uuid";

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

export const uploadFile = async (file: FileUpload) => {
  const { createReadStream, filename, mimetype, encoding } = await file;

  const fileStream = createReadStream();

  const uploadParams: PutObjectRequest = {
    Bucket: bucketName as string,
    Body: fileStream,
    Key: `${v4()}${extname(filename)}`,
    ContentType: mimetype,
  };

  return s3.upload(uploadParams).promise();
};
