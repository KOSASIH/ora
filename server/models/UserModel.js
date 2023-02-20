import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
const schema = new mongoose.Schema({
    userName:{  
        type: 'string',
        unique:true,
        trim:true,
        required:[true,'Tên tài khoản là bắt buộc và phải chứa từ 6 đến 30 ký tự'],
        minlength:[6, 'Tên tài khoản là bắt buộc và phải chứa từ 6 đến 30 ký tự']
    },
    lang:{
        type:'string',
    },
    socialIdFacebook:{
        type:'string',
    },
    password:{  
        type: 'string',
        trim:true,
        required:[true,'Mật khẩu nên chứa từ 6 đến 100 ký tự'],
        minlength:[6, 'Mật khẩu nên chứa từ 6 đến 100 ký tự']
    },
    mail: {
        type: 'string',
    },
    displayName: {
        type: 'string',
    },
    gender : {
        type:'string'
    },
    intro: {
        type: 'string',
    },
    avatar: {
        type: 'string',
    },
    cover: {
        type: 'string',
    },
    mobile: {
        type: 'number'
    },
    identification: {
        type: 'string'
    },
    address: {
        type: 'string'
    },

    followers : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default:[],
        }
    ],   
    following : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default:[],
        }
    ],   
    postSaved: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            default:[],
        }
    ],
    isVerified: {
        type: Boolean,
        default: false,
    },
    isConfirmed: {
        type: Boolean,
        default: false,
    },
    isBlockedCmt: {
        type: Boolean,
        default: false,
    },
    isBlockedAll: {
        type: Boolean,
        default: false,
    },
    dateOfBirth : {
        type: 'string'
    },
    monthOfBirth : {
        type: 'string'
    },
    yearOfBirth : {
        type: 'string'
    },
    category : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            default:[],
        }
    ]     
    
}, {
    timestamps: true
})
schema.index({displayName: 'text' , userName:'text'});
schema.pre('save', function(next){
    let user = this;
    bcrypt.hash(user.password,10,(err,hash) =>{
        if(err){
            return next(err)
        }else{
            user.password  = hash
            next()
        }
    })
})
export const UserModel = mongoose.model('User', schema)