const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./Review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    url: String,
    filename: String,
  },

  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner:{
    type : mongoose.Schema.Types.ObjectId,
    ref:"User",
  },
});

listingSchema.post("findOneAndDelete", async (data) => {
  if(data){
  await Review.deleteMany({_id: { $in: data.reviews }});
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
