
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {Service, serviceSchema} = require('../models/service')
const validator = require('validator')
const AppError = require('../helper/appErrors')

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, 'Please provide your first name'],
            maxlength: 20
        },

        lastName: {
            type: String,
            trim: true,
            maxlength: 20,
            default: 'lastName'
        },
        skills: {
            type: [String],
            validate: {
                validator: function(v) {
                    return v == null || (Array.isArray(v) && v.every(skill => typeof skill === 'string' && skill.trim() !== ''));
                },
                message: 'Skills must be an array of non-empty strings'
            }
        },
        
        email: {
            type: String,
            required: [true, 'please provide your email'],
            validate: {
                validator: validator.isEmail,
                message: 'Please provide a valid email'
            },
            unique: true
        },
        location: {
            type: String, 
            trim: true,
            maxlength: 20,
            default: 'my city',
            required: function() {
                return this.type === 'freelancer'
              }
        },

        portfolio: [{
            type: Buffer,
        }], 

        hourlyRate: {
            type: Number,
            required: function() {
                return this.type === 'freelancer'
              }
            
        }, /* .....*/

        availableForHire: {
            type: Boolean,
            required: function() {
                return this.type === 'freelancer'
              },
              default: true
          },

          experience: {
            type: String,
            required: function() {
                return this.type === 'freelancer'
              }
          },

          type: {
            type: String,
            required: [true, 'please indicate freelancer or client'],
            enum: ['client', 'freelancer']
          },
          
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'

        },
        password: {
            type: String,
            required: [true, 'please provide a password']
        },
        tokens: [
            {
            token: {
                type: String,
                required: true
            }
        }
        ],

        avatar: {
            type: Buffer
        },

        awardedProjects: [serviceSchema]
        
        },
        {
        timestamps: true
    }, {
        toJSON: {virtuals: true},
        toObject: {virtuals: true},
     
     })



    userSchema.virtual('services', {
        ref: 'Service',
        localField: '_id',
        foreignField: 'user'
    })

    userSchema.virtual('reviews', {
        ref: 'Review',
        localField: '_id',
        foreignField: 'user',
        
     })

    

 

    userSchema.methods.toJSON = function (){
        const user = this
        const userObj = user.toObject()
        delete userObj.password
        delete userObj.tokens
        delete userObj.avatar
        
        return userObj
    }

    userSchema.methods.generateJwtAuthToken = async function () {
        const user = this

        const token = jwt.sign({_id: user._id.toString()}, process.env.JSON_WEB_TOKEN_KEY, 
        { expiresIn: process.env.JWT_LIFETIME })
        

        user.tokens = user.tokens.concat({ token })
        await user.save()
        return token


    }

    



    userSchema.statics.findByUserCredentials = async (email, password) => {

        const user = await User.findOne({email})

        if(!user) {
            throw new AppError('Cannot login. attempt Unauthorized', 401)
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)

        if(!isPasswordMatch){
            throw new AppError('Cannot login. attempt unAuthorized', 401)
        }

        return user

    

    }


    
    userSchema.pre('save', async function(next){
        const user = this
    
        if (user.isModified('password')){
    
            user.password = await bcrypt.hash(user.password, 8)
        }
        
        next()
    })

    //delete all user services when user is removed.
    userSchema.pre('remove', async function (next) {
        const user = this
        await Service.deleteMany({userId: user._id})

        next()
    })

const User = mongoose.model('User', userSchema)

module.exports = User