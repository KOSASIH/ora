import {
    PostModel,
} from "../models/PostModel.js";
import {
    UserModel
} from "../models/UserModel.js";
import { v2 as cloudinary } from 'cloudinary'
export const getAllPosts = async (req, res, next) => {
    try {
        const posts = await PostModel.find().sort({createdAt:-1})
        .populate('author','userName avatar displayName postSaved')
        .populate('category','name slug')
        res.status(200).json({
            status: 'OK',
            data: {
                posts
            }
        });
    } catch (err) {
        res.status(500).json({
            error: err,
        });
    }
};
export const getPostsByCategory = async (req, res, next) => {
    const {cateId} = req.params
    try {
        const posts = await PostModel.find({
            category: cateId
        })
        .populate('author','userName avatar displayName postSaved' )
        .populate('category','name slug')
        res.status(200).json({
            status: 'OK',
            data: {
                posts
            }
        });
    } catch (err) {
        res.status(500).json({
            error: err,
        });
    }
};
export const getPostsByUserName = async (req, res, next) => {
    const {username} = req.params
    const user = await UserModel.find({
        userName: username
    })
   const userId= user[0]._id.toString()
    try {
        const posts = await PostModel.find({
            author: userId
        })
        .populate('author','userName avatar postSaved')
        .populate('category','name')
        res.status(200).json({
            status: 'OK',
            data: {
                posts
            }
        });
    } catch (err) {
        res.status(500).json({
            error: err,
        });
    }
};

export const createPost = async (req, res, next) => {
    try {
        const {userId} = req.user
        if(req.body.title.length < 10 ){
            res.status(500).json({
                err:"Tiêu đề bài viết không được để trống và phải nhiều hơn 10 kí tự"
            })
        }
        if(req.body.content.blocks.length === 0 ){
            res.status(500).json({
                err:"Có lỗi khi tạo bài viết"
            })
        }
        const att = req.body.content.blocks.filter((url) =>{
            if(url.type === "image") {
              return url.data.file
            }
          })
          const url = att.map((e) => { 
              return e.data.file.url
          })
        if(url.length !== 0){
            const post = await PostModel.create({...req.body, author: userId,vote:userId,attachment:url[0].toString()})
            res.status(200).json({
                status: 'OK',
                data:{
                    slug:post.slug,
                    id:post._id,
                    status: 'Bài viết được tạo thành công',
                }
            })
        }
        else if(url.length === 0) {
            const post = await PostModel.create({...req.body, author: userId,vote:userId})
            res.status(200).json({
                status: 'OK',
                data:{
                    slug:post.slug,
                    id:post._id,
                    status: 'Bài viết được tạo thành công',
                }
            })
        }

    } catch (err) {
        res.status(500).json({
            err:"Có lỗi khi tạo bài viết"
        })
    }
};
export const updatePost = async (req, res, next) => {
    try {
        const {postId} = req.params
        const att = req.body.content.blocks.filter((url) =>{
            if(url.type === "image") {
              return url.data.file
            }
          })
          const url = att.map((e) => { 
              return e.data.file.url
          })
        const post = await PostModel.findByIdAndUpdate(postId, {...req.body,attachment:url.toString()} , {new: true, runValidator:true})
        res.status(200).json({
            status: 'OK',
            data:post
        })
    } catch (err) {
        next(err)
    }

};
export const deletePost = async (req, res, next) => {
    try {
        const { postId } = req.params

        await PostModel.findByIdAndDelete(postId)
        res.status(200).json({
            status: 'OK',
            message:'Bài viết đã được xóa thành công'
        })
    } catch (err) {
        next(err)
    }
};
export const uploadImage = async (req, res, next) => {
    try {
        const fileStr = req.file;
        const uploadResponse = await cloudinary.uploader.upload(fileStr.path, {
            folder:"postimg"
        });
       
        res.status(200).json({
            "success" : "1",
            "file": {
                "url" : `https://${uploadResponse.url.slice(7)}`, 
            }
          
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
}
export const getPost = async (req, res, next) => {
    try {
        const post = await PostModel.findOne({slug: req.params.slug })
        .populate('author','userName displayName avatar intro postSaved')
        .populate('category', 'name slug attachment')
        res.status(200).json({
            status: 'success',
            post: post,
            points: post.vote.length - post.unVote.length,
        })
    }catch (error) {
        res.json(error)
    }
};
export const getPostUserSaved = async (req, res, next) => {
    try {
        const post = await PostModel.find({
            _id : { $in: req.body.postId },
        })
        .populate('author','userName displayName avatar intro postSaved')
        .populate('category', 'name slug attachment')
        res.status(200).json({
            status: 'success',
            post: post
        })
    }catch (error) {
        res.json(error)
    }
};
export const updateView = async (req, res, next) => {
    const postId = req.body.postId
    const prevViews = await PostModel.findById({_id:postId})
    try {
        const post = await PostModel.findByIdAndUpdate(postId, {
            views :  prevViews.views + 1
        }, {
            new: true,
            runValidator: true
        })
        res.status(200).json({
            status: 'OK',
            data: post
        })
    } catch (err) {
        next(err)
    }

};
export const getAllPostsCategoryUser = async (req, res, next) => {
    try {
        const {userId} = req.user
        const find = await UserModel.findOne({_id:userId})
        if(find.category.length > 0) {
            const posts = await PostModel.find({
                category : { $in: find.category },
              }).sort({createdAt:-1})
              .populate('author','userName avatar displayName postSaved ' )
              .populate('category','name slug ')
              res.status(200).json({
                status: 'success',
                data: posts
                })
        }
        else if (find.category.length === 0 ){
            const posts = await PostModel.find().sort({createdAt:-1})
            .populate('author','userName avatar displayName postSaved')
            .populate('category','name slug')
            res.status(200).json({
                status: 'success',
                data: posts
                })
        }
    }catch (error) {
        res.json(error)
    }
};
export const votePost = async (req, res, next) => {
    const {userId} = req.user
    const findPost = await PostModel.findOne({_id :req.body.postId })
    // 1 vote
    if(req.body.action === '1') {
        try {   
            const find =  await PostModel.find({
                _id : { $in: req.body.postId },
                vote : { $in: userId }
            })
            if(find.length === 0){
                const data = await PostModel.findOneAndUpdate({_id:req.body.postId
                }, {
                    $push: {
                        vote:userId
                    },
                    $pull: {
                        unVote:userId
                    }
                }, {
                        new: true
                })
                res.status(200).json({
                    status: 'success',
                    points: data.vote.length - data.unVote.length,
                })
            }
            else if (find.length !== 0){
                const data = await PostModel.findOneAndUpdate({
                    _id:req.body.postId
                }, {
                    $pull: {
                        vote: userId
                    }
                }, {
                    new: true
                })
                res.status(200).json({
                    status: 'OK',
                    points: data.vote.length - data.unVote.length,
                })
            }
    
        } catch (err) {
            next(err)
        }
    }
    // 2 unvote
    else if ( req.body.action === '2') {
        try {   
            const find =  await PostModel.find({
                _id : { $in: req.body.postId },
                vote : { $in: userId }
            })
            if(find.length === 0){
                try {   
                    const findUnVote =  await PostModel.find({
                        _id : { $in: req.body.postId },
                        unVote : { $in: userId }
                    })
                    if(findUnVote.length === 0){
                        const data = await PostModel.findOneAndUpdate({_id:req.body.postId
                        }, {
                            $push: {
                                unVote:userId
                            },           
                        }, {
                                new: true
                        })
                        res.status(200).json({
                            status: 'success',
                            points: data.vote.length - data.unVote.length,
                        })
                    }
                    else if (findUnVote.length !== 0){
                        const data = await PostModel.findOneAndUpdate({
                            _id:req.body.postId
                        }, {
                            $pull: {
                                unVote: userId
                            }
                        }, {
                            new: true
                        })
                        res.status(200).json({
                            status: 'OK',
                            points: data.vote.length - data.unVote.length,
                        })
                    }
            
                } catch (err) {
                    next(err)
                }
            }
            else if (find.length !== 0){
                await PostModel.findOneAndUpdate({_id:req.body.postId
                }, {
                    $pull: {
                        vote: userId
                    }                        
                }, {
                        new: true
                })
                try {   
                    const findUnVote =  await PostModel.find({
                        _id : { $in: req.body.postId },
                        unVote : { $in: userId }
                    })
                    if(findUnVote.length === 0){
                        const data = await PostModel.findOneAndUpdate({_id:req.body.postId
                        }, {
                            $push: {
                                unVote:userId
                            },                     
                        }, {
                                new: true
                        })
                        res.status(200).json({
                            status: 'success',
                            points: data.vote.length - data.unVote.length,
                        })
                    }
                    else if (findUnVote.length !== 0){
                        const data = await PostModel.findOneAndUpdate({
                            _id:req.body.postId
                        }, {
                            $pull: {
                                vote: userId
                            },
                        }, {
                            new: true
                        })
                        res.status(200).json({
                            status: 'OK',
                            points: data.vote.length - data.unVote.length,
                        })
                    }
            
                } catch (err) {
                    next(err)
                }
            }
    
        } catch (err) {
            next(err)
        }
    }
};

