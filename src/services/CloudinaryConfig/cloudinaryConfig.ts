import { CloudinaryStorage } from "multer-storage-cloudinary";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "Restaurant-management-system",
  }),
});

// const oldImageDelete = async (publicId: string) => {
//   try {
//     await cloudinary.uploader.destroy(publicId);
//     console.log("Delete", publicId);
//   } catch (err) {
//     console.log("Delete Failed", err);
//   }

export { cloudinary, storage };
