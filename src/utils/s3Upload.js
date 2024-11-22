import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import imageCompression from "browser-image-compression";

const uploadFileToS3 = async (file, onSuccess, onError) => {
  const S3_BUCKET = import.meta.env.VITE_APP_AWS_S3_BUCKET;
  const REGION = import.meta.env.VITE_APP_AWS_REGION;
  const ACCESS_KEY_ID = import.meta.env.VITE_APP_AWS_ACCESS_KEY_ID;
  const SECRET_ACCESS_KEY = import.meta.env.VITE_APP_AWS_SECRET_ACCESS_KEY;

  const s3Client = new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
    },
  });

  try {
    let fileToUpload = file;

    // Check if file size is greater than 1MB (1MB = 1 * 1024 * 1024 bytes)
    if (file.size > 1 * 1024 * 1024 && file.type.startsWith("image/")) {
      console.log("Compressing image...");
      const options = {
        maxSizeMB: 1, // Target size in MB
        maxWidthOrHeight: 1920, // Optional: Resize image to reduce file size further
        useWebWorker: true,
      };
      fileToUpload = await imageCompression(file, options);
      console.log("Image compressed successfully");
    }

    const params = {
      Bucket: S3_BUCKET,
      Key: fileToUpload.name,
      Body: fileToUpload,
    };

    const command = new PutObjectCommand(params);
    const data = await s3Client.send(command);

    const location = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${fileToUpload.name}`;
    if (onSuccess) onSuccess(location);
  } catch (err) {
    console.error("Error uploading file:", err);
    if (onError) onError(err);
  }
};

export default uploadFileToS3;
