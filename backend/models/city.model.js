const mongoose = require("mongoose");
const citySchema = mongoose.Schema({
  name: { type: String, required: true },
  currentTemp: { type: Number, required: true },
  pref: { type: String, default: "c", enum: ["c", "f", "k"] },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
});

const Citymodel = mongoose.model("city", citySchema);

module.exports = {
  Citymodel,
};

// {
//   "name":"durgapur",
//   "currentTemp":35.5
// }
