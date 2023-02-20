import {
    NotificationModel,
} from "../models/NotificationModel.js";
import {
    UserModel
} from '../models/UserModel.js'
export const createPostNotifications = async (req, res, next) => {
    const {userId} = req.user
    const postId = req.body.postId
    const user = req.body.user
    if(postId) {
        try {
            const find = await UserModel.find({_id: userId})
            .select("followers")
            const getUser = find.map((e)=>{
                return e.followers
            })
            const notification = getUser.flat().forEach(async (item) => await NotificationModel.create({user: item,parentId: userId,post:postId}))
            res.status(200).json({
                status: 'OK',
                data: notification
            });
        } catch (err) {
            res.status(500).json({ 
                error: err,
            });
        }
    }
    else if (!postId &&  user) {
        try {
            const notification = await NotificationModel.create({user: user,parentId: userId})
            res.status(200).json({
                status: 'OK',
                data: notification
            });
        } catch (err) {
            res.status(500).json({ 
                error: err,
            });
        }
    }

};
export const getPostNotifications= async (req, res, next) => {
    const {userId} = req.user
    try {
        const notification = await  NotificationModel.find({user:userId}).sort({createdAt:-1})
        .populate('parentId' , 'userName displayName avatar')
        .populate('post','title description slug attachment')
        res.status(200).json({
            status: 'success',
            data: notification
        })
    }catch (error) {
        res.json(error)
    }
};
export const readPostNotifications = async (req, res, next) => {
    const notificationID = req.body.notificationID
    try {
        const notification = await NotificationModel.findByIdAndUpdate(notificationID,{...req.body,isRead:true} , {new: true, runValidator:true})
        res.status(200).json({
            status: 'success',
            data: notification
        })
    }catch (error) {
        res.json(error)
    }
};
