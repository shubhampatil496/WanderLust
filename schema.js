const joi = require("joi");

module.exports.listingSchema = joi.object({
    Listing : joi.object({
        title : joi.string().required(),
        description : joi.string().required(),
        location : joi.string().required(),
        country : joi.string().required(),
        price : joi.number().min(0),
        image : joi.string().allow("",null),
        coordinates: joi.object({
            lat: joi.number().allow(null),
            lng: joi.number().allow(null),
        }).allow(null)
    }).required()
})

module.exports.reviewSchema = joi.object({
    review:joi.object({
        rating: joi.number().min(1).max(5).required(),
        comment: joi.string().required()
    }).required()
})