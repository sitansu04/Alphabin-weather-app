const express = require("express");
require("dotenv").config();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const cors = require("cors");
const { connection } = require("./config/db");
const { Citymodel } = require("./models/city.model");
const { limiter } = require("./middlewares/ratelimiter.middleware");
const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  try {
    res.status(200).send({ msg: "Welcome to Alphabin-Weather-App" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
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
    res.status(201).json(out);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

app.get("/forecast", async (req, res) => {
  try {
    const city = req.query.city;
    const apiKey = process.env.API_KEY;
    const data = await fetch(
      `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${apiKey}`
    );
    const out = await data.json();
    res.status(201).json(out);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

app.post("/save", async (req, res) => {
  try {
    const payload = req.body;

    const ex_city = await Citymodel.findOne({ name: payload.name });

    if (!ex_city) {
      const new_city = new Citymodel(payload);
      await new_city.save();
      return res.status(201).send({ msg: `${payload.name} is saved` });
    } else {
      return res.status(400).send({ msg: `${payload.name} already exists` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
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
