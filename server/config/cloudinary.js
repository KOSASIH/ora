import dotenv from 'dotenv'
dotenv.config()
const CLOUDNAME = process.env.CLOUDNAME;
const CLOUDKEY = process.env.CLOUDKEY;
const CLOUDSECRET = process.env.CLOUDSECRET;
import { config, uploader } from 'cloudinary';
const cloudinaryConfig = () => config({
  cloud_name: CLOUDNAME, 
  api_key: CLOUDKEY,
  api_secret: CLOUDSECRET
});

export { cloudinaryConfig, uploader };