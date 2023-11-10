const Service = require('../models/service')
const {catchAsync} = require('../helper/catchPromiseRejection')


 exports.getServices = catchAsync(async (req, res, next)=>{
    const services = await Service.find({})
    res.status(200).send(services)
    console.log(services)

    next()

})

