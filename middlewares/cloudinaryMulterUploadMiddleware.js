import dotenv from "dotenv";
dotenv.config();

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from 'cloudinary'

const { CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

if (!CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error(
    "Cloudinary environment variables are missing! Please check .env file."
  );
}


cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});



const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "user_avatar",
    // format: async (req, file) => 'jpg', 
    public_id: (req, file) => 'computed-filename-using-request',
  },

});




const upload = multer({ storage });


export default upload;
