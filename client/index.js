import dotenv from 'dotenv'
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'
import posts from './routers/posts.js'
import auth from './routers/auth.js'
import path from 'path'
import category from './routers/category.js'
import search from './routers/search.js'
import reply from './routers/reply.js'
import comments from './routers/comments.js'
import notifications from './routers/notifications.js'
import messages from './routers/message.js'
import conversation from './routers/conversation.js'
import notiMessage from './routers/notiMessage.js'
import { connect } from './config/db.js'
import {errorHandler} from './middlewares/errorHandler.js'
import {fileURLToPath} from 'url';
import { v2 as cloudinary } from 'cloudinary'
import mountPaymentsEndpoints from './controllers/payments.js';
import mountUserEndpoints from './controllers/payments.js';
dotenv.config()
const app = express();
const PORT = process.env.APP_PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Payments endpoint under /payments:
const paymentsRouter = express.Router();
mountPaymentsEndpoints(paymentsRouter);
app.use('/payments', paymentsRouter);

// User endpoints (e.g signin, signout) under /user:
const userRouter = express.Router();
mountUserEndpoints(userRouter);
app.use('/userPi', userRouter);
cloudinary.config({ 
  cloud_name: 'sarintoxic', 
  api_key: '738932943592546',
  api_secret: 'Iu_h8lpgfwLbCyPt0au93hyBIz4'
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
connect()
app.use(bodyParser.json({extended: true, limit: '30mb'}))
app.use(bodyParser.urlencoded({ extended: true, limit:'30mb' }))

app.use(cors())
app.use('/api/v1/posts',posts)
app.use('/api/v1/auth',auth )
app.use('/api/v1/category', category)
app.use('/api/v1/search/', search)
app.use('/api/v1/comment/', comments)
app.use('/api/v1/reply/', reply)
app.use('/api/v1/messages/', messages)
app.use('/api/v1/conversation/', conversation)
app.use('/api/v1/notifications/', notifications)
app.use('/api/v1/notimes/', notiMessage)
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, './build')));
app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, './build/index.html'));
});
app.get('/login', (req,res) => {
  res.sendFile(path.join(__dirname, './build/index.html'));
});
app.get('/signup', (req,res) => {
  res.sendFile(path.join(__dirname, './build/index.html'));
});
app.get('/post/:slug', (req,res) => {
  res.sendFile(path.join(__dirname, './build/index.html'));
});
app.get('/register', (req,res) => {
  res.sendFile(path.join(__dirname, './build/index.html'));
});
app.get('/tao-tai-khoan', (req,res) => {
  res.sendFile(path.join(__dirname, './build/index.html'));
});
app.get('/user/settings', (req,res) => {
  res.sendFile(path.join(__dirname, './build/index.html'));
});
app.get('/user/:username', (req,res) => {
  res.sendFile(path.join(__dirname, './build/index.html'));
});
app.get('/category/:slug', (req,res) => {
  res.sendFile(path.join(__dirname, './build/index.html'));
});
app.get('/messages/', (req,res) => {
  res.sendFile(path.join(__dirname, './build/index.html'));
});

app.get('/messages', (req,res) => {
  res.sendFile(path.join(__dirname, './build/index.html'));
});

app.all('*',(req, res, next) => {
  const err = new Error ('404 NOT FOUND')
  err.statusCode = 404
  next(err)
})
app.use(errorHandler)
//static folder

