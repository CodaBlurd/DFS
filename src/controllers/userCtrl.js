const User = require('../models/user')
const sharp = require('sharp')

const Review = require('../models/review')
const { catchAsync } = require('../helper/catchPromiseRejection')
const { sendEmail} = require('../emails/account')
const { deleteOne, createOne, updateOne, getOne } = require('./handlerFactory')
const AppError = require('../helper/appErrors')
const { calAvgRating } = require('../utils/calAvgRating')
const { router } = require('..')


const signup = catchAsync(async (req, res, next) => {
    const user = new User({ ...req.body });

    user.experience = parseInt(user.experience);

    // Save the user to the database
    await user.save();

    // Prepare the email object
    const emailObject = {
        from: 'example@domain.com',
        to: user.email,
        subject: 'Welcome to DFS',
        text: `Thank you for registering with us ${user.name}`
    };

    // Send welcome email

  sendEmail(emailObject)

    // Generate JWT token
    const token = await user.generateJwtAuthToken()

    // Send response
    res.status(201).send({ user, token })
});


const loginUser = catchAsync(async (req, res, next)=>{

    
    const user = await User.findByUserCredentials(req.body.email, req.body.password)
    const token = await user.generateJwtAuthToken()
    res.send({user, token})
}) 

const logOut = catchAsync (async (req, res, next)=>{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.status(200).send()

       

})

const updateUser = catchAsync (async (req, res, next)=>{
    const permittedUpdates = ['email', 'name', 'location','password', 'address', 'experience', 'hourlyRate', 'skills']

    const updates = Object.keys(req.body)

    
    updates.every(update => permittedUpdates.includes(update))

    if(!updates.every((update)=>permittedUpdates.includes(update))){
        return next(new AppError('Updated not allowed', 400))
    }
 
        
        updates.forEach(update => req.user[update] = req.body[update])
        const user = await req.user.save()

        const userObj = {
            user,
            token:req.token,
            location: user.location
        }

        res.status(200).send(userObj)
})

const imageUpload = catchAsync(async (req, res, next) =>{
    const buffer = await sharp(req.file.buffer).resize({
        height: 300,
        width: 300
    }).png().toBuffer()
    console.log(buffer)

    req.user.avatar = buffer
    await req.user.save()
    res.send()
})

const fileUp = catchAsync(async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
        return next(new AppError('No files provided', 400));
    }

    // Process each file and add to the user's portfolio
    const processingFiles = req.files.map(async (file) => {
        const buffer = await sharp(file.buffer)
            .resize({ height: 300, width: 300 }) // Adjust size as needed
            .png()
            .toBuffer();

        req.user.portfolio.push(buffer);
    });

    // Wait for all files to be processed
    await Promise.all(processingFiles);

    // Save the user with updated portfolio
    await req.user.save();
    res.status(200).send({ message: 'Files uploaded successfully' });
});

const getUserImage = catchAsync(async (req, res, next)=>{

        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
         
           return next(new AppError('not found', 404))
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

})

const getUserPortfolio = catchAsync(async (req, res, next)=>{

    const user = await User.findById(req.params.id)
    if(!user || !user.avatar){
     
       return next(new AppError('not found', 404))
    }

    res.set('Content-Type', 'image/png')
    res.send(user.avatar)

})

const deleteImageUploaded = catchAsync(async (req, res, next) =>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

// const getFreelancer = catchAsync(async (req, res)=>{

//     const freelancer = await User.findById(req.params.id).populate({
//         path: 'reviews',
        
//     })
//     if(!freelancer) {
//         return next(new AppError('No freelancer found with that ID', 404))
//       }
//     console.log(freelancer.populated)
//     res.status(200).send(freelancer)




// })

const getUser = catchAsync(async (req, res)=>{

    let query = req.user

    const reviews = await Review.find({_id: req.user._id})

   query = query.populate({path: 'reviews', select: 'review rating reviewerName -_id -user'})

  const user = await query

 const avgRating = await calAvgRating(req.user._id)

 const userObj = {
    user,
    avgRating,
    reviews: user.reviews
 }

    res.status(200).send(userObj)

    // console.log(userObj)
})


const getFreelancer = catchAsync(async (req, res) => {
    
      const freelancer = await User.findById(req.params.id).populate({
        path: 'reviews',
        select: 'rating review createdAt -user -_id',
      })
  
      const avgRating = await calAvgRating(req.params.id);
  
      const freelancerObj = {
        user: freelancer,
        avgRating,
        reviews: freelancer.reviews,
      };
  
      res.status(200).json(freelancerObj);
     
  })
  




const deleteUser = catchAsync (async (req, res, next)=>{

        // Prepare the email object
        const emailObject = {
            from: 'example@domain.com',
            to: req.user.email,
            subject: 'Canceled!',
            text: `We are sorry to see you go, hope you come back soon! ${req.user.name}`
        };

        await req.user.remove()
        sendEmail(emailObject)
        res.status(204).send()

})

const getAllUsers = catchAsync(async (req, res, next)=>{


        const freelancers = await User.find({ type: 'freelancer'})
        if(freelancers.length === 0 ){
            next(new AppError('No freelancers found', 404))
            return
        }
        res.status(200).send({
            status: 'success',
            results: freelancers.length,
            numOfPages: 1,
            freelancers
        })

}) 


 const freelancerInfo = catchAsync(async (req, res) => {
  
      const freelancer = await User.findOne({ _id: req.params.freelancerId, type: 'freelancer' });
      if (!freelancer) {
        return new AppError('Not found', 404)
      }
      res.json({ freelancerId: freelancer._id })
  
     
    
  })

  const clientInfo = catchAsync( async (req, res) => {

    const user = await User.findById(req.user._id)
    if (!user) {
      return new AppError('not found', 404)
    }

    res.json({ userId: user._id, token: req.header('x-auth-token') })

  })
  




module.exports = {
    signup,
    loginUser,
    updateUser,
    imageUpload,
    getFreelancer,
    fileUp,
    getUserImage,
    deleteImageUploaded,
    getUser,
    getAllUsers,
    deleteUser, 
    logOut,
    freelancerInfo,
    clientInfo

}

