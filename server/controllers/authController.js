import {
    UserModel
} from "../models/UserModel.js";
import { NotificationModel } from "../models/NotificationModel.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
var otp = 241001;
export const register = async (req, res, next) => {
    try {
        const user = await UserModel.create({
            ...req.body,
            isVerified: true,
            isConfirmed: true
        })
        const token = jwt.sign({
            userId: user._id
        }, process.env.APP_SECRET)
        res.status(200).json({
            status: 'OK',
            data: {
                token,
            }
        });
    } catch (err) {
        next(err)
    }
};
export const login = async (req, res, next) => {
    try {
        const user = await UserModel.findOne({
            userName: req.body.userName
        })
        if (!user) {
            const err = new Error('Sai tên đăng nhập hoặc mật khẩu')
            err.statusCode = 400
            return next(err)
        }
        if (req.body.password === user.password) {
            const token = jwt.sign({
                userId: user._id
            }, process.env.APP_SECRET)
            res.status(200).json({
                status: 'OK',
                data: {
                    token,
                    _id: user._id,
                    userName: user.userName,
                    displayName: user.displayName,
                    mobile: user.mobile,
                }
            });
        }
        if (bcrypt.compareSync(req.body.password, user.password)) {
            const token = jwt.sign({
                userId: user._id
            }, process.env.APP_SECRET)
            res.status(200).json({
                status: 'OK',
                data: {
                    token,
                    _id: user._id,
                    userName: user.userName,
                    displayName: user.displayName,
                    mobile: user.mobile,
                }
            });
        } else {
            const err = new Error('Mật khẩu bạn vừa nhập không chính xác')
            err.statusCode = 400
            return next(err)
        }
    } catch (err) {
        res.status(500).json({
            error: err,
        });
    }
};
export const getCurrentUser = async (req, res, next) => {
    try {
        const data = {
            user: null
        }
        if (req.user) {
            const user = await UserModel.findOne({
                    _id: req.user.userId
                })
                .populate('category', 'slug attachment name _id ')
            data.user = user
        }
        res.status(200).json({
            status: 'success',
            data: data
        })
    } catch (error) {
        res.json(error)
    }
};
export const createCategoryUser = async (req, res, next) => {
    const {
        userId
    } = req.user
    try {
        const data = await UserModel.findOneAndUpdate({
            _id: userId
        }, {
            $push: {
                category: {
                    $each: req.body,
                }
            }
        }, {
            new: true
        })
        res.status(200).json({
            status: 'OK',
            data: data,
        })
    } catch (err) {
        next(err)
    }
};
export const deleteCategoryUser = async (req, res, next) => {
    const {
        userId
    } = req.user
    try {
        const data = await UserModel.findOneAndUpdate({
            _id: userId
        }, {
            $pull: {
                category: {
                    $in: req.body
                }
            }
        }, {
            new: true
        })
        res.status(200).json({
            status: 'OK',
            data: data,
        })
    } catch (err) {
        next(err)
    }
};
export const updateUser = async (req, res, next) => {
    try {
        const {
            userId
        } = req.user
        const user = await UserModel.findByIdAndUpdate(userId, {
            ...req.body
        }, {
            new: true,
            runValidator: true
        })
        res.status(200).json({
            status: 'OK',
            data: user
        })
    } catch (err) {
        next(err)
    }

};
export const updatePassword = async (req, res, next) => {
    try {
        const {
            userId
        } = req.user
        const getUser = await UserModel.findOne({
            _id: userId
        })
        const result = bcrypt.compareSync(req.body.oldPassword, getUser.password)
        if (result) {
            req.body.password = await bcrypt.hash(req.body.password, 10)
            const user = await UserModel.findByIdAndUpdate(userId, {
                ...req.body,
                password: req.body.password
            }, {
                new: true,
                runValidator: true
            })
            res.status(200).json({
                status: 'OK',
                data: "Cập nhật mật khẩu thành công"
            });
        } else {
            const err = new Error('Mật khẩu cũ không chính xác')
            err.statusCode = 400
            return next(err)
        }
    } catch (err) {
        res.status(500).json({
            error: err,
        });
    }
};
export const updateUserEmail = async (req, res, next) => {
    try {
        const {
            userId
        } = req.user
        const getUser = await UserModel.findOne({
            _id: userId
        })
        const result = bcrypt.compareSync(req.body.password, getUser.password)
        if (result) {
            await UserModel.findByIdAndUpdate(userId, {
                mail: req.body.mail
            }, {
                new: true,
                runValidator: true
            })
            res.status(200).json({
                status: 'OK',
                data: "Cập nhật thành công"
            });
        } else {
            const err = new Error('Mật khẩu không chính xác')
            err.statusCode = 400
            return next(err)
        }
    } catch (err) {
        res.status(500).json({
            error: err,
        });
    }
};
export const updateFollower = async (req, res, next) => {
    const {
        userId
    } = req.user // id current user when click flow
    const targetUser = req.body.toString()
    await UserModel.findOneAndUpdate({
        _id: targetUser
    }, {
        $push: {
            followers: userId
        }
    }, {
        new: true
    })
    try {
        const data = await UserModel.findOneAndUpdate({
            _id: userId
        }, {
            $push: {
                following: req.body
            }
        }, {
            new: true
        })
        await NotificationModel.create({user: targetUser,parentId: userId})
        res.status(200).json({
            status: 'OK',
            data: data
        })
    } catch (err) {
        next(err)
    }
};
export const updateUnFollower = async (req, res, next) => {
    const {
        userId
    } = req.user // id current user when click flow
    const targetUser = req.body.toString()
    await UserModel.findOneAndUpdate({
        _id: targetUser
    }, {
        $pull: {
            followers: {
                $in: userId
            }
        }
    }, {
        new: true
    })
    try {
        const data = await UserModel.findOneAndUpdate({
            _id: userId
        }, {
            $pull: {
                following: {
                    $in: req.body
                }
            }
        }, {
            new: true
        })
        res.status(200).json({
            status: 'OK',
            data: data,
        })
    } catch (err) {
        next(err)
    }
};
export const getUser = async (req, res, next) => {
    const {
        username
    } = req.params
    const data = {
        user: null
    }
    try {
        const user = await UserModel.findOne({
            userName: username
        })
        data.user = user
        res.status(200).json({
            status: 'OK',
            data: data
        });
    } catch (err) {
        res.status(500).json({
            error: err,
        });
    }
};
export const   getUserById = async (req, res, next) => {
    const userId = req.params.id
    const data = {
        user: null
    }
    try {
        const user = await UserModel.findOne({
            _id:  userId
        })
        data.user = user
        res.status(200).json({
            status: 'OK',
            data: data
        });
    } catch (err) {
        res.status(500).json({
            error: err,
        });
    }
};
export const authFacebook = async (req, res, next) => {
    try {
        const user = await UserModel.find({
            socialIdFacebook: req.body.uid
        })
        if (user.length !== 0) {
            const findUser = await UserModel.findOne({
                socialIdFacebook: req.body.uid
            })
            res.status(200).json({
                status: 'OK',
                data: {
                    _id: findUser._id,
                    userName: findUser.userName,
                    password: findUser.password
                }
            });
        }
        if (user.length === 0) {
            res.status(200).json({
                status: 'OK',
                data: null,
            });
        }
    } catch (error) {
        res.status(500).json({
            error: error,
        });
    }
};
export const authMail = async (req, res, next) => {
    const email = req.body.email;
   
    try {
        const user = await UserModel.find({
            mail: email
        })
        if(user.length === 0){
       
        const token = jwt.sign(otp, process.env.APP_SECRET)
        res.status(200).json({
            status: 'OK',
            data: "Xác thực tài khoản Pi Network thành công"
        });
        
        }
        else {
            res.status(200).json({
                status: 'Dublicated',
                data: "Tài khoản Pi Network này đã được đăng ký trước đó!",
            });
        }
    
      } 
    catch (error) {
        res.status(500).json({
            error: error,
        });
    }
};
export const confirmEmail = async (req, res, next) => {
    const getOTP= req.body.otp
    try {
        if (getOTP === otp){
            const token = jwt.sign(otp, process.env.APP_SECRET)
            res.status(200).json({
                status: 'OK',
                data: token
            });
        }
        else{
            res.status(500).json({
                status: 'ERR',
                data: "Mã OTP bạn nhập không chính xác"
            });
        }
    } catch (error) {
        res.status(500).json({
            error: error,
        });
    }
};
export const userSavedPost = async (req, res, next) => {
    try {
        const {userId} = req.user
        const postId = req.body.postId
        const find =  await UserModel.find({
            _id : { $in: userId },
            postSaved : { $in: postId}
        })
        if(find.length === 0){
            const data = await UserModel.findOneAndUpdate({_id:userId
            }, { 
                $push: {
                    postSaved:postId
                }
            }, {
                new: true
            })
            res.status(200).json({
                status: 'success',
                data: "Bài viết đã được lưu lại thành công",
            })
        }
        else if (find.length !== 0){
            const data = await UserModel.findOneAndUpdate({
                _id:userId
            }, {
                $pull: {
                    postSaved:postId
                }
            }, {
                new: true
            })
            res.status(500).json({
                status: 'OK',
                data: "Bỏ lưu thành công",
            })
        }

    } catch (err) {
        next(err)
    }
};
