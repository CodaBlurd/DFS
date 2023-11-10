
const mongoose = require('mongoose')


const bidSchema = mongoose.Schema({
    freelancerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    bidAmount: {
        type: Number,
        required: true
    },
    proposal: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    deliveryTime: {
        type: Number,
        required: true

    },

    references: {
        type: [String],
        validate: {
            validator: function(v) {
                return v == null || (Array.isArray(v) && v.every(url => validator.isURL(url, { protocols: ['http','https'], require_protocol: true })));
            },
            message: props => `${props.value} is not a valid URL!`
        }
    },

    paid: {
        type: Boolean,
        default: false
    },
    responseTime: {
        type: Number,
        required: [true, 'Response time is required']
    },

},  {timestamps: true},

{
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
    })


const Bid = mongoose.model('Bid', bidSchema)

bidSchema.pre(/^find/, function(next){
    const bid = this
    bid.populate({
        path: 'freelancerId'
    })

    next()
})

//calculate responseTime when a bid is saved
bidSchema.pre('save', function(next) {
    if (this.isNew) {
        // Assuming you have a field 'servicePostedAt' in your Service model
        // You'll need to adjust this based on your actual model structure
        Service.findById(this.serviceId).then(service => {
            if (service && service.createdAt) {
                const postedAt = new Date(service.createdAt);
                this.responseTime = (new Date() - createdAt) / (1000 * 60 * 60); // Time in hours
            }
            next();
        }).catch(err => next(err));
    } else {
        next();
    }
});


module.exports = Bid

