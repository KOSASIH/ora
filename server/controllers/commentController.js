import { CommentsModel } from "../models/CommentsModel.js";
import { PostModel } from "../models/PostModel.js";
export const  getCommentsPost = async (req, res, next) => {
    const postId = req.params.id
    try {
        const comments = await CommentsModel.find({post: postId}).sort({createdAt:-1})
        .populate('author','userName avatar displayName')
        .populate('post','_id')
        res.status(200).json({
            status: 'OK',
            data: {
                comments
            }
        });
    } catch (err) {
        res.status(500).json({
            error: err,
        });
    }
};
export const  getAllComments = async (req, res, next) => {
    try {
        const comments = await CommentsModel.find()
        res.status(200).json({
            status: 'OK',
            data: {
                comments
            }
        });
    } catch (err) {
        res.status(500).json({
            error: err,
        });
    }
};
export const createComment = async (req, res, next) => {
    const {userId} = req.user
    const postId = req.body.postId
    try {
        const comment = await CommentsModel.create({...req.body, author: userId,post:postId, voteCount:userId})
        const findPost = await PostModel.findOne({_id: postId})
        await PostModel.findOneAndUpdate({_id: postId}, {comment_count: findPost.comment_count + 1})
        res.status(200).json({
            status: 'OK',
            data:{
                comment
            }
        })
    } catch (err) {
        next(err)
    }
};
export const deleteComment = async (req, res, next) => {
    const commentId = req.body.commentId
    
    try {
       
        await CommentsModel.findByIdAndDelete(commentId)
        res.status(200).json({
            status: 'OK',
            message:'Bình luận đã được xóa thành công'
        })
    } catch (err) {
        next(err)
    }
};

export const voteComment = async (req, res, next) => {
    try {
        const {userId} = req.user
        const find =  await CommentsModel.find({
            _id : { $in: req.body.commentId },
            voteCount : { $in: userId }
        })
        if(find.length === 0){
            const data = await CommentsModel.findOneAndUpdate({_id:req.body.commentId
            }, {
                $push: {
                    voteCount:userId
                }
            }, {
                new: true
            })
            res.status(200).json({
                status: '1',
                data: data,
            })
        }
        else if (find.length !== 0){
            const data = await CommentsModel.findOneAndUpdate({
                _id:req.body.commentId
            }, {
                $pull: {
                    voteCount: userId
                }
            }, {
                new: true
            })
            res.status(200).json({
                status: 'OK',
                data: data,
            })
        }

    } catch (err) {
        next(err)
    }
};



export const voteComment2 = async (req, res, next) => {
    try {
        const {userId} = req.user
        const find =  await CommentsModel.find({
            _id : { $in: req.body.commentId },
            voteCount : { $in: userId }
        })
        if(req.body.action === "1") {
            if(find.length === 0){
                const data = await CommentsModel.findOneAndUpdate({_id:req.body.commentId
                }, {
                    $push: {
                        voteCount:userId
                    }
                }, {
                    new: true
                })
                res.status(200).json({
                    status: '1',
                    data: data,
                })
            }
            else if (find.length !== 0){
                const data = await CommentsModel.findOneAndUpdate({
                    _id:req.body.commentId
                }, {
                    $pull: {
                        voteCount: userId
                    }
                }, {
                    new: true
                })
                res.status(200).json({
                    status: 'OK',
                    data: data,
                })
            }
        }
        if(req.body.action === "2"){
            if(find.length === 0){
                const data = await CommentsModel.findOneAndUpdate({_id:req.body.commentId
                }, {
                    $push: {
                        unVote:userId
                    }
                }, {
                    new: true
                })
                res.status(200).json({
                    status: '1',
                    data: data,
                })
            }
            else if (find.length !== 0){
                const data = await CommentsModel.findOneAndUpdate({
                    _id:req.body.commentId
                }, {
                    $pull: {
                        unVote:userId
                    }
                }, {
                    new: true
                })
                res.status(200).json({
                    status: 'OK',
                    data: data,
                })
            }
        }

    } catch (err) {
        next(err)
    }
};
