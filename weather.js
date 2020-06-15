//let url = "https://api.openweathermap.org/data/2.5/weather?q=copenhagen&appid=b3239c7eaddeb6dd2ef7235478b440d9";
let url = "";

function fetchData(url) {
  document.getElementById("weather-data").innerHTML = "Loading data";
  return fetch(url).then(response => {
    return response.json();
  });
}

const input = document.getElementById("city");
const btn = document.getElementById("btn-city");

btn.addEventListener("click", () => {
  if (input.value) {
    const valueCity = input.value.toLowerCase();
    url =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      valueCity +
      "&appid=b3239c7eaddeb6dd2ef7235478b440d9";
    fetchData(url).then(data => renderData(data));
  }
});

input.addEventListener("keyup", event => {
  if (event.keyCode === 13) {
    event.preventDefault();
    btn.click();
  }
});

function renderData(data) {
  resetView();

  const div = document.getElementById("weather-data");
  div.className = "visible";

  // The chosen city
  const cityName = document.createElement("h1");
  div.appendChild(cityName);

  if (data.name === undefined) cityName.innerHTML = `Wrong city name`;
  else cityName.innerHTML = data.name;

  // put city to localstorage
  localStorage.setItem("lastLocation", data.name);

  for (weather of data.weather) {
    const pW = document.createElement("p");
    pW.className = "bold";
    const img = document.createElement("img");
    div.appendChild(pW);
    div.appendChild(img);

    // Icon for the weather type
    img.src = "http://openweathermap.org/img/wn/" + weather.icon + ".png";
    pW.innerHTML = weather.main;

    switch (weather.main) {
      case "Clear":
        document.body.style.backgroundImage = "url('images/sunny.jpg')";
        break;
      case "Clouds":
        document.body.style.backgroundImage = "url('images/cloudy.jpg')";
        break;
      case "Drizzle":
        document.body.style.backgroundImage = "url('images/drizzle.jpg')";
        break;
      case "Rain":
        document.body.style.backgroundImage = "url('images/rain.jpg')";
        break;
      case "Thunderstorm":
        document.body.style.backgroundImage = "url('images/thunderstorm.jpg')";
        break;
      case "Snow":
        document.body.style.backgroundImage = "url('images/snow.jpg')";
        break;
      case "Mist":
      case "Haze":
      case "Sand":
      case "Ash":
      case "Fog":
      case "Dust":
        document.body.style.backgroundImage = "url('images/fog.jpg')";
        break;
      case "Tornado":
        document.body.style.backgroundImage = "url('images/tornado.jpg')";
        break;
      case "Squall":
        document.body.style.backgroundImage = "url('images/squall.jpg')";
        break;
      default:
        document.body.style.backgroundImage = "url('images/clear-sky.jpg')";
    }
  }

  const pItem = document.createElement("p");
  pItem.className = "temp";
  div.appendChild(pItem);

  // Temperature
  Object.keys(data.main).forEach(function(item) {
    if (item === "temp") {
      const currentTemp = (data.main[item] - 273.15).toFixed(0);
      pItem.innerHTML = `${currentTemp} °C`;
    }
  });

  // Wind speed
  const pWind = document.createElement("p");
  div.appendChild(pWind);
  pWind.innerHTML = `Wind speed: ${data.wind.speed}m/s`;

  // How clowdy it is
  const pClouds = document.createElement("p");
  div.appendChild(pClouds);
  pClouds.innerHTML = `Cloudiness: ${data.clouds.all}%`;

  // When sunrise and sunset is
  const pSunrise = document.createElement("p");
  const pSunset = document.createElement("p");
  div.appendChild(pSunrise);
  div.appendChild(pSunset);
  const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
  const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
  pSunrise.innerHTML = `Sunrise: ${sunrise}`;
  pSunset.innerHTML = `Sunset: ${sunset}`;

  // Optional a map showing where the city is located
  const mainDiv = document.getElementById("main");
  const mapDiv = document.createElement("div");
  mapDiv.classList.add = "map";
  mainDiv.appendChild(mapDiv);
  mapDiv.innerHTML = `<div style="width: 100%"><iframe width="500" height="300" src="https://maps.google.com/maps?q=${data.name}&t=&z=11&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe></div>`;
}

function resetView() {
  const resultsDiv = document.querySelector("#main");
  resultsDiv.innerHTML = "";
  const div = document.createElement("div");
  div.id = "weather-data";
  resultsDiv.appendChild(div);
}

// Add a button to your page, clicking this button will get the users current position.
// Use that position to fetch weather data from that position.

const btnPosition = document.getElementById("btn-position");

btnPosition.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(function(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=b3239c7eaddeb6dd2ef7235478b440d9`;
    fetchData(url).then(data => renderData(data));
    input.value = "";
  });
});

// When a user has gotten a location through either the input element or the geo location api, save that location using localstorage.
// Localstorage is a way to save data even when you close the browser.
// Now when loading the page and there is a city in the localstorage, use that to get the current weather.
function showSavedLocation() {
  const valueCity = localStorage.getItem("lastLocation");
  url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    valueCity +
    "&appid=b3239c7eaddeb6dd2ef7235478b440d9";

  fetchData(url).then(data => renderData(data));
}

if (localStorage && localStorage.getItem("lastLocation"))
  window.addEventListener("load", showSavedLocation());
