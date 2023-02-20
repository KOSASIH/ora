import jwt from 'jsonwebtoken'
export const verifyToken = (req,res,next) => {
    const Authorization = req.header('authorization')
    if(!Authorization) {
        const err  = new Error ('Truy cập trái phép !!!!')
        err.statusCode = 401
        return next(err)
    }
    // Get token
    const token = Authorization.replace("Bearer ","");
    // Verify token
    const {userId} = jwt.verify(token,process.env.APP_SECRET)
    // Assign req
    req.user = {userId};
    next()
}