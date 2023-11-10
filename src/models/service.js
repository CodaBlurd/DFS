const mongoose = require('mongoose')



const serviceSchema = new mongoose.Schema({
   title: {
    type: String,
    required: true,
    trim: true

   },
   category: {
      type: String,
      required: true
   },
   budget: {
      type: Number,
      required: true,
      validate: {
          validator: function(value) {
              return value > 0;
          },
          message: 'Budget must be greater than 0'
      },
      max: [10000, 'Budget cannot exceed 10000'] // Replace 10000 with your desired maximum limit
  },
  

   description: {
    type: String,
    required: true
   },

   imageUrl: {
    type: String,
    
   },
   user: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'A service must have a client'],
    ref: 'User'
   },
   freelancerId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [false, 'A service must have an assigned freelancer once the bid is accepted'],
    },

    biddingStatus: {
      type: String,
      default: 'Open',
      enum: {
          values: ['Open', 'Closed', 'In Progress'],
          message: '{VALUE} is not a valid bidding status'
      }
  },
  
   expiresAt: {
      type: Date,
      required: true
      // required: true
   }
}, {
   timestamps: true

},

{
   toJSON: {virtuals: true},
   toObject: {virtuals: true},

}, )

serviceSchema.virtual('expiresIn').set(function (value) {
   const expiration = new Date(value)
   if (isNaN(expiration.valueOf())) {
     throw new Error('Invalid date')
   }
   this.expiresAt = expiration
 });

serviceSchema.virtual('bids', {
   ref: 'Bid',
   foreignField: 'service',
   localField: '_id'

})



const Service = mongoose.model('Service', serviceSchema)


module.exports = {Service, serviceSchema}