import  { MessagesModel } from '../models/MessagesModel.js'
import  { NotificationMessage } from '../models/NotificationMessage.js'
export const  createMessage = async (req, res, next) =>{
    try {
        const  newMessage = await MessagesModel.create({
            sender: req.body.sender,
            text:  req.body.text,
            conversationId: req.body.conversationId,
        })
        await NotificationMessage.create({
            parentId: req.body.sender,
            user:req.body.receiverId,
        })
        res.status(200).json(newMessage);
    } catch (err) {
        res.status(500).json({
            error: err,
        });
    }
};
export const  getMessage = async (req, res, next) =>{
    try {
        const messages = await MessagesModel.find({
            conversationId: req.params.conversationId,
        })
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({
            error: err,
        });
    }
};


