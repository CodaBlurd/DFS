class AppError extends Error {
    //constructor to construc error object
    constructor(message, statusCode){
        super(message)

        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error' 

        this.isOperational = true

        Error.captureStackTrace(this, this.constructor)


    }
}

module.exports = AppError