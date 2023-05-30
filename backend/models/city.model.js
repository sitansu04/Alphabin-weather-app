const mongoose = require("mongoose");
const citySchema = mongoose.Schema({
  name: String,
  currentTemp: Number,
  ip: String,
});

const Citymodel = mongoose.model("city", citySchema);

module.exports = {
  Citymodel,
};
