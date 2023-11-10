exports.globalErrorHandler = (error, req, res, next)=>{

    
    error.statusCode = error.statusCode || 500
    error.status = error.status || 'error'

    if( error.code && error.code === 11000 ){
        error.statusCode = 400
        error.message = `${Object.keys(error.keyValue)} already in use`
    } else if(error.name === "TokenExpiredError") {
        error.statusCode = 401
        error.message = `Auth failed, token expired. please relogin`


    }

    res.status(error.statusCode).send({
        status: error.status,
        message: error.message
    })

}