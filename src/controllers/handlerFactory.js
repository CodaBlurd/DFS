
const {catchAsync} = require('../helper/catchPromiseRejection')
const AppError = require('../helper/appErrors')
const {Service} = require('../models/service')


exports.createOne = Model => catchAsync(async (req, res, next) => {
    let doc;
    if (Model.modelName === 'Bid') {
        const serviceId = req.body.service.toString();
        const service = await Service.findById(serviceId);

        if (!service || service.expiresAt.getTime() <= Date.now()) {
            return next(new AppError('Service not found or bidding time expired', 400));
        }
        
        doc = new Model({
            ...req.body,
            freelancerId: req.user._id // Assuming the bidder is the logged-in user
        });
    } else {
        doc = new Model({
            ...req.body,
            user: req.user._id // Assuming the creator is the logged-in user
        });
    }

    await doc.save();
    res.status(201).send(doc);
});


exports.getOne = (Model, populateOptions1, populateOptions2) => catchAsync(async (req, res, next) => {
    let query = Model.findOne({ _id: req.params.id, user: req.user._id });

    if (populateOptions1) query = query.populate(populateOptions1);
    if (populateOptions2) query = query.populate(populateOptions2);

    const doc = await query;
    if (!doc) {
        return next(new AppError('Document not found', 404));
    }

    res.status(200).send(doc);
});

exports.updateOne = (Model, ...permittedUpdates) => catchAsync(async (req, res, next) => {
    const updates = Object.keys(req.body);
    const isAllowedUpdate = updates.every(update => permittedUpdates.includes(update));

    if (!isAllowedUpdate) {
        return next(new AppError('Invalid updates', 400));
    }

    const doc = await Model.findOne({ _id: req.params.id, user: req.user._id });
    if (!doc) {
        return next(new AppError('Document not found', 404));
    }

    updates.forEach(update => doc[update] = req.body[update]);
    await doc.save();
    res.send(doc);
});

exports.getAll = (Model, popOptions1, popOptions2) => catchAsync(async (req, res, next) => {
    let query = Model.find({ user: req.user._id });

    if (popOptions1) query = query.populate(popOptions1);
    if (popOptions2) query = query.populate(popOptions2);

    const docs = await query;
    res.status(200).send(docs);
});


exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!doc) {
        return next(new AppError('Document not found', 404));
    }
    res.status(204).send();
});

