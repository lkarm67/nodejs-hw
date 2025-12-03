import { Readable } from 'node:stream';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
/*
console.log({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET ? '******' : null
});
*/

export async function saveFileToCloudinary(buffer) {
  //console.log("saveFileToCloudinary викликано");

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'notehub-app/avatars',
        resource_type: 'image',
        overwrite: true,
        unique_filename: true,
        use_filename: false,
      },
      (err, result) => (err ? reject(err) : resolve(result))
    );

    const readable = new Readable();
    readable._read = () => {};// пустий _read
    readable.push(buffer);
    readable.push(null); // кінець потоку

    readable.pipe(uploadStream);
    //console.log("Пушу файл у Cloudinary, buffer.length =", buffer.length);

  });
}
