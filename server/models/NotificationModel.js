import mongoose from "mongoose";
import slug from "mongoose-slug-generator";
mongoose.plugin(slug);
var schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    parentId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isRead:{
        type:Boolean,
        default:false
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
}, {
    timestamps: true
})
export const NotificationModel = mongoose.model('Notification', schema)