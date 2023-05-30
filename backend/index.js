const express = require("express");
require("dotenv").config();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const cors = require("cors");
const geoip = require("geoip-lite");
const unirest = require("unirest");
const { connection } = require("./config/db");
const { Citymodel } = require("./models/city.model");
const { limiter } = require("./middlewares/ratelimiter.middleware");
const { ipSave } = require("./middlewares/ip.middleware");
const app = express();

app.use(express.json());
app.use(cors());
app.set("trust proxy", true);

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
      `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${apiKey}`
    );
    const out = await data.json();
    return res.status(201).json(out);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
});

app.post("/save", ipSave, async (req, res) => {
  try {
    const payload = req.body;
    const ip = req.body.ip;

    const ex_city = await Citymodel.find({
      $and: [{ name: payload.name.toLowerCase() }, { ip: ip }],
    });

    if (ex_city.length == 0) {
      const new_city = new Citymodel(payload);
      await new_city.save();
      return res.status(201).send({ msg: `${payload.name} is saved` });
    } else {
      return res.status(400).send({ msg: `${payload.name} already exists` });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
});

app.delete("/delete/:id", ipSave, async (req, res) => {
  try {
    const id = req.params.id;
    const ip = req.body.ip;
    const city = await Citymodel.find({
      $and: [{ _id: id }, { ip: ip }],
    });
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

// app.get("/currLocation", async (req, res) => {
//   try {
//     let lat, lon;
//     const apiCall = unirest(
//       "GET",
//       "https://ip-geolocation-ipwhois-io.p.rapidapi.com/json/"
//     );
//     apiCall.headers({
//       "x-rapidapi-host": "ip-geolocation-ipwhois-io.p.rapidapi.com",
//       "x-rapidapi-key": "a8e7d82e4dmsh53e8c803f3e5ebep122fb5jsnc150bf37d498",
//     });
//     apiCall.end(function (result) {
//       if (res.error) throw new Error(result.error);
//       console.log(result.body);
//       lat = result.latitude;
//       lon = result.longitude;
//       res.send({ lat: lat, lon: lon });
//     });
//     // const geo = geoip.lookup(ip);
//     // const city = geo.city;
//     // const apiKey = process.env.API_KEY;
//     // const data = await fetch(
//     //   `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${apiKey}`
//     // );
//     // const out = await data.json();
//     // return res.status(201).json(out);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({ error: error.message });
//   }
// });

app.listen(PORT, async () => {
  try {
    await connection;
  } catch (error) {
    console.log(error);
  }

  console.log(`Server is started at http://localhost:${PORT}`);
});
