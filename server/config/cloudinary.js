import dotenv from 'dotenv'
dotenv.config()
import { config, uploader } from 'cloudinary';
const cloudinaryConfig = () => config({
  cloud_name: "",
  api_key: "",
  api_secret: ""
});

export { cloudinaryConfig, uploader };