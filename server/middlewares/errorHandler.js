export const errorHandler = (err,req,res,next) => {
    err.statusCode =  err.statusCode || 500;
    // Dulication
    if(err.code === 11000){
        err.statusCode = 400;
        for( let p in err.keyValue){
            err.message = `Tên tài khoản đã tồn tại`
        }
    }   
    // Object ID not found 
    if(err.kind === 'ObjectId'){
        err.statusCode = 404
        err.message = ` ${req.originalUrl} không thể tìm thấy vì sai ID`
    } 

    // Validation
    if(err.errors) { 
        err.statusCode = 400;
        err.message = []
        for (let p in err.errors){
            err.message.push(err.errors[p].properties.message)
        }
    }

    res.status(err.statusCode).json({
        status: 'fail',
        message: err.message
    })
}