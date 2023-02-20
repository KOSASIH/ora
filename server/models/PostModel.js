import mongoose from "mongoose";
import slug from "mongoose-slug-generator";
mongoose.plugin(slug);
var schema = new mongoose.Schema({
    hagtagId:{  
        type: 'string',
    },
    title: {
        type: String,
        text: true,
        trim: true,
        required:[true,'Tiêu đề bài viết không được để trống và phải nhiều hơn 10 kí tự'],
        minlength:[10, 'Tiêu đề bài viết không được để trống và phải nhiều hơn 10 kí tự'],
    },
    content: [
        mongoose.Schema.Types.Mixed,
    ],
    description: {
        type: 'string'
    },
    slug: { type: String, slug: 'title', unique: true },
    vote: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default:[],
        }
    ],   
    unVote: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default:[],
        }
    ],  
    views : {
        type:Number,
        default:0,
    },
    attachment: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    comment_count: { 
        type: Number,
        default:0
    }
}, {
    timestamps: true
})
schema.index({title: 'text'});
export const PostModel = mongoose.model('Post', schema)