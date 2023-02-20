import {
    PostModel,
} from "../models/PostModel.js";
import {
    UserModel
} from "../models/UserModel.js";
// post : img , cate , title, desc, auth avt, auth name
// user: displayName, avt
export const search = async (req, res, next) =>{
    try {
        const posts = await PostModel.find({  $text: { $search: `"${req.query.q}"`  } })
        .populate('author','userName avatar displayName')
        .populate('category','name slug')
        const users = await UserModel.find({  $text: { $search: `"${req.query.q}"`  } })
        .select('userName avatar displayName') ; 
        res.status(200).json({
            status: 'OK',
            data: {
                posts,
                users
            }
        });
    } catch (err) {
        res.status(500).json({
            error: err,
        });
    }
};


