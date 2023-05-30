const mongoose = require("mongoose");
const citySchema = mongoose.Schema({
  name: String,
  currentTemp: Number,
});

const Citymodel = mongoose.model("city", citySchema);

module.exports = {
  Citymodel,
};
