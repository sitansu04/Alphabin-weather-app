const express = require("express");
require("dotenv").config();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const cors = require("cors");
const { connection } = require("./config/db");
const { Citymodel } = require("./models/city.model");
const { limiter } = require("./middlewares/ratelimiter.middleware");
const { userRouter } = require("./routes/user.routes");
const { authenticate } = require("./middlewares/authentication.middleaware");
const app = express();

app.use(express.json());
app.use(cors());
app.use("/user", userRouter);

const PORT = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  try {
    return res.status(200).send({ msg: "Welcome to Alphabin-Weather-App" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
});

app.get("/current", limiter, async (req, res) => {
  try {
    const city = req.query.city;
    const apiKey = process.env.API_KEY;
    const data = await fetch(
      `https://api.weatherbit.io/v2.0/current?city=${city}&key=${apiKey}`
    );
    const out = await data.json();
    return res.status(201).json(out);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
});

app.get("/forecast", async (req, res) => {
  try {
    const city = req.query.city;
    const apiKey = process.env.API_KEY;
    const data = await fetch(
      `https://api.weatherbit.io/v2.0/forecast/daily?days=7&city=${city}&key=${apiKey}`
    );
    const out = await data.json();
    return res.status(201).json(out);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
});

app.post("/save", authenticate, async (req, res) => {
  try {
    const name = req.body.name;
    const currentTemp = req.body.currentTemp;
    const userID = req.body.userID;
    const pref = req.body.pref;
    const ex_city = await Citymodel.find({
      $and: [{ name: name }, { user: userID }],
    });

    // let cities = await Citymodel.find({ user: userID });
    // if (cities.length > 6) {
    //   return res.status(400).send({ msg: "please delete one of the city" });
    // }

    if (ex_city.length == 0) {
      const new_city = new Citymodel({ name, currentTemp, pref, user: userID });
      await new_city.save();
      return res.status(201).send({ msg: `city is saved` });
    } else {
      return res.status(400).send({ msg: `city already exists` });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
});

app.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const city = await Citymodel.find({ _id: id });
    if (city.length > 0) {
      await Citymodel.findByIdAndDelete({ _id: id });
      return res.status(200).send({ msg: "City deleted successfully" });
    } else {
      return res.status(400).send({ msg: "City doesn't exists" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
});

app.get("/savedCity", authenticate, async (req, res) => {
  try {
    const userID = req.body.userID;
    const cities = await Citymodel.find({ user: userID });
    return res.status(200).json(cities);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
});

app.listen(PORT, async () => {
  try {
    await connection;
  } catch (error) {
    console.log(error);
  }

  console.log(`Server is started at http://localhost:${PORT}`);
});
