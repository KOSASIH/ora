import axios from "axios";
import dotenv from 'dotenv'
dotenv.config()
const KEY = process.env.PI_API_KEY;
const platformAPIClient = axios.create({
  baseURL: 'https://api.minepi.com',
  timeout: 20000,
  headers: { 'Authorization': `Key ${KEY}` }
});

export default platformAPIClient;