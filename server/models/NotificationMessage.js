import mongoose from "mongoose";
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
}, {
    timestamps: true
})
export const NotificationMessage = mongoose.model('NotificationMessage', schema)