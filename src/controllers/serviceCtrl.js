const { Service } = require('../models/service');
const APIFeatures = require('../utils/apiFeatures');
const { catchAsync } = require('../helper/catchPromiseRejection');
const { deleteOne, createOne, updateOne, getOne, getAll } = require('./handlerFactory');

// Creates new service
const addNewService = createOne(Service);

// Gets service by ID and populate with its bids
const getService = getOne(Service, 'bids');

// Gets all services with user details
const allServices = getAll(Service, { path: 'user', select: 'name' });

// Array of permitted updates for the service update route
const permittedUpdates = ['name', 'category', 'budget', 'description'];

// Updates service; allows only updates in the permitted updates array
const updateService = updateOne(Service, ...permittedUpdates);

// Deletes service by ID
const deleteService = deleteOne(Service);

// Gets all services based on user type
const getAllServices = catchAsync(async (req, res) => {
    const query = Service.find().populate({ path: 'user', select: 'name' });
    if (req.user.type === "freelancer") {
        query.where({}); // Adjust the query for freelancers as needed
    } else {
        query.where({ user: req.user._id });
    }

    const features = new APIFeatures(query, req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const services = await features.query;
    res.status(200).send({
        status: 'success',
        results: services.length,
        numOfPages: 1, // Consider calculating the actual number of pages
        services
    });
});

module.exports = {
    addNewService,
    getService, 
    getAllServices,
    updateService, 
    allServices,
    deleteService,
};
