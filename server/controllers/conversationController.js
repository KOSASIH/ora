import { ConversationModel } from "../models/ConversationModel.js";
export const  newConversation = async (req, res, next) =>{
    const {userId} = req.user
    const recei = req.body.receiverId
    if(recei) { 
        const find= await ConversationModel.find({
            members : {$all: [userId, recei]},
        })
        if(find.length === 0) {
            try {
                const conversation= await ConversationModel.create({members: [userId, req.body.receiverId]})
                res.status(200).json({
                    status: 'OK',
                    data: conversation
                });
            } catch (err) {
                res.status(500).json({
                    error: err,
                });
            }
        }
    }

};
export const  getConversation = async (req, res, next) =>{
    try {
        const conversation = await ConversationModel.find({
            members : { $in: req.params.userId },
        }).sort({createdAt:-1})
        res.status(200).json({
            status: 'OK',
            data: conversation
        });
    } catch (err) {
        res.status(500).json({
            error: err,
        });
    }
};


