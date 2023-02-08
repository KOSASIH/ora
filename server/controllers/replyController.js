import {
    replyCommentModel,
} from "../models/replyCommentModel.js";
import { PostModel } from "../models/PostModel.js";
export const replyComment = async (req, res, next) => {
    const commentId = req.params.id
    const postId = req.body.postId
    const {userId} = req.user
    try {
        const reply = await replyCommentModel.create({content: req.body.reply.content, author: userId,post:postId, voteCount:userId , parent_id: commentId})
        const findPost = await PostModel.findOne({_id: postId})
        await PostModel.findOneAndUpdate({_id: postId}, {comment_count: findPost.comment_count + 1})
        res.status(200).json({
            status: 'OK',
            data: {
                reply
            }
        });
    } catch (err) {
        res.status(500).json({
            error: err,
        });
    }
};
export const  getReplyComment = async (req, res, next) => {
    const parentId = req.params.id
    try {
        const reply = await replyCommentModel.find({parent_id: parentId}).sort({createdAt:-1})
        .populate('author','userName avatar displayName')
        .populate('post','_id')
        res.status(200).json({
            status: 'OK',
            data: {
                reply
            }
        });
    } catch (err) {
        res.status(500).json({
            error: err,
        });
    }
};
export const voteReplyComment = async (req, res, next) => {
    try {
        const {userId} = req.user
        const find =  await replyCommentModel.find({
            _id : { $in: req.body.replyId },
            voteCount : { $in: userId }
        })
        if(find.length === 0){
            const data = await replyCommentModel.findOneAndUpdate({_id:req.body.replyId
            }, {
                $push: {
                    voteCount:userId
                }
            }, {
                new: true
            })
            res.status(200).json({
                status: 'success',
                data: data,
            })
        }
        else if (find.length !== 0){
            const data = await replyCommentModel.findOneAndUpdate({
                _id:req.body.replyId
            }, {
                $pull: {
                    voteCount: userId
                }
            }, {
                new: true
            })
            res.status(200).json({
                status:'success',
                data: data,
            })
        }
    } catch (err) {
        next(err)
    }
};