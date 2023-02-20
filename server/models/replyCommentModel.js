import mongoose from "mongoose";
import slug from "mongoose-slug-generator";
mongoose.plugin(slug);
var schema = new mongoose.Schema({
    content: {
        type: String,
    }, 
    voteCount: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default:[],
        }
    ],
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    parent_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comments'
    }
}, {
    timestamps: true
})
export const replyCommentModel = mongoose.model('replyComment', schema)