const baseUrl = "https://alphabin-weather-app.cyclic.app/";

let saveData = {};

async function getdata() {
  var inputVal = document.getElementById("searchTxt").value;
  let unit = document.getElementById("units").value;
  console.log(unit);

  const res = await fetch(`${baseUrl}forecast?city=${inputVal}`);

  getWeekDay();
  const data = await res.json();

  console.log(data);
  const temparature_F = Math.ceil(data.data[0].temp * 1.8) + 32;
  const temparature_k = data.data[0].temp + 273;

  document.getElementById("location").innerText = data.city_name;
  document.getElementById("locationParts").innerText = data.country_code;
  document.getElementById("dateTime").innerText = data.data[0].datetime.substr(
    0,
    10
  );
  document.getElementById("txtWord").innerText =
    data.data[0].weather.description;
  document.getElementById("humidity").innerText =
    "Humidity: " + data.data[0].rh + "%";
  document.getElementById("precipitation").innerText =
    "Precipitation: " + data.data[0].precip + "%";
  document.getElementById("wind").innerText =
    "Wind: " + data.data[0].wind_spd + "km/h";
  //   document.getElementById("temperatureC").innerText =
  //     data.data[0].temp + " C";
  //   document.getElementById("temperatureF").innerText =
  //     temparature_F + " F";
  //   document.getElementById("weatherIcon").src =
  //     "https:" + data.data[0].weather.icon;
  //   obj["name"] = data.city_name;
  if (unit == "c") {
    document.getElementById("temperatureC").innerText =
      data.data[0].temp + " C";
    // obj["currentTemp"] = data.data[0].temp;
  } else if (unit == "f") {
    document.getElementById("temperatureC").innerText = temparature_F + " F";
    // obj["currentTemp"] = temparature_F;
  } else if (unit == "k") {
    document.getElementById("temperatureC").innerText = temparature_k + " K";
    // obj["currentTemp"] = temparature_k;
  }

  let obj = {
    name: data.city_name,
    currentTemp: data.data[0].temp,
    pref: unit,
  };
  saveData = obj;
  console.log(obj);

  let forecast = data.data.map((e, i) => {
    let temp_f = Math.ceil(e.temp * 1.8) + 32;
    let temp_k = e.temp + 273;
    if (unit == "c") {
      return `
    <div id="forecast_child">
          <p>${e.datetime}</p>
          <p id="forecast_temp">${e.temp} C</p>
          <p>${e.weather.description}</p>
        </div>
    `;
    } else if (unit == "f") {
      return `
        <div id="forecast_child">
              <p>${e.datetime}</p>
              <p id="forecast_temp">${temp_f} F</p>
              ${e.weather.description}
            </div>
        `;
    } else if (unit == "k") {
      return `
        <div id="forecast_child">
              <p>${e.datetime}</p>
              <p id="forecast_temp">${temp_k} K</p>
              ${e.weather.description}
            </div>
        `;
    }
  });

  let ans = [];
  for (let i = 1; i < forecast.length; i++) {
    ans.push(forecast[i]);
  }

  document.querySelector(".forecast").innerHTML = ans.join(" ");
  console.log(saveData);
}

function getWeekDay() {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const d = new Date();
  let day = weekday[d.getDay()];
  document.getElementById("weekDay").innerText = day;
}

const token = localStorage.getItem("token");
async function savefunction() {
  let data = await fetch(`${baseUrl}save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(saveData),
  });
  if (data.ok) {
    let out = await data.json();
    alert(out.msg);
    fetchsavecity();
  }
  console.log(token);
}

async function fetchsavecity() {
  let data = await fetch(`${baseUrl}savedCity`, {
    headers: {
      Authorization: token,
    },
  });
  let res = await data.json();
  console.log(res);
  //   if (res.length > 6) {
  //     alert("You saved maximun number of cities please delete first");
  //     return;
  //   }

  let mappeddata = res.map((e, i) => {
    return `
    <div id="city_child">
        <p>${e.name}</p>
        <p>${e.pref}</p>
        <p id="city_temp">${e.currentTemp} C</p>
        <button class="delete" data-id=${e._id}>Delete</button>
      </div>
    `;
  });
  document.querySelector(".cities").innerHTML = mappeddata.join(" ");
  let Deleters = document.querySelectorAll(".delete");
  for (let i = 0; i < Deleters.length; i++) {
    Deleters[i].addEventListener("click", (e) => {
      deleteEvent(e.target.dataset.id);
    });
  }
}
fetchsavecity();

async function deleteEvent(id) {
  let data = await fetch(`${baseUrl}delete/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (data.ok) {
    alert("City deleted succeffully");
    fetchsavecity();
  }
}
