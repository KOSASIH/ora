import { NotificationMessage } from "../models/NotificationMessage.js";
export const getMessagesNotifications= async (req, res, next) => {
    const {userId} = req.user
    var counts = {};
    try {
        const notification = await NotificationMessage.find({user:userId})
        .populate('parentId' , 'userName displayName avatar')
        const read = notification.filter(({isRead}) => isRead === false).length
        notification.forEach(function(x) { counts[x.parentId._id] = (counts[x.parentId._id] || 0)+1; })
        const countNoti =  Object.keys(counts).length
        res.status(200).json({
            status: 'success',
            data: {
                notification : notification,
                isRead : read,
                count : countNoti
            }
        })
    }catch (error) {
        res.json(error)
    }
};

export const readMessagesNotification= async (req, res, next) => {
    const {userId} = req.user
    const targetUser  = req.body.targetUser
    try {
        const find = await NotificationMessage.find({user : userId , parentId : targetUser})
        const map = find.map((e) => e._id)
        map.forEach(async (item) => await NotificationMessage.findByIdAndDelete(item.toString()))
        res.status(200).json({
            status: 'success',
        })
    }catch (error) {
        res.json(error)
    }
};
