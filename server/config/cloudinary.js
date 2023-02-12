import dotenv from 'dotenv'
dotenv.config()
import { config, uploader } from 'cloudinary';
const cloudinaryConfig = () => config({
  cloud_name: 'sarintoxic', 
  api_key: '738932943592546',
  api_secret: 'Iu_h8lpgfwLbCyPt0au93hyBIz4'
});

export { cloudinaryConfig, uploader };