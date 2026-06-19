import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
});

export const uploadToCloudinary = async (filePath, public_id) => {
  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        use_filename: true,
        folder: "shopit/",
        chunk_size: 7_000_000,
        resource_type: "auto",

        overwrite: true,
        public_id: new Date().getTime() + (public_id ? `-${public_id}` : ""),
      },
      (err, res) => {
        console.log("the code is here");
        console.log("err", err);
        console.log("Cloudinary upload response:", res);
        if (err) {
          throw new Error(`Cloudinary upload failed: ${err.message}`);
        }
        if (!res) return reject(new Error("Cloudinary returned no response"));
        resolve(res);
      },
    );
  });

  return result;
};

export default cloudinary;
