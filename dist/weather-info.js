let weatherData;
let forecastData;

async function forSearch() {
  const city = document.getElementById("city").value;
  if (city.length < 1) {
    alert("Must Provide a City Name!");
    return;
  }
  require("dotenv").config(); 
  const api = process.env.api; 
  const currentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api}`; //link from the website
  const hourlyForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api}`;

  try {
    //promise always needs await!!!!!!!
    const response = await fetch(currentWeather);
    if (response.ok) {
      weatherData = await response.json();
      localStorage.setItem("weatherDataKey", JSON.stringify(weatherData)); //json is object, so you need to turn it into string format to pass it in setItem.
    } else {
      throw new Error("City current weather not found.");
    }
  } catch (err) {
    console.error(err);
    alert(err);
  }
  try {
    const response1 = await fetch(hourlyForecast);
    if (response1.ok) {
      forecastData = await response1.json();
      localStorage.setItem("forecastDataKey", JSON.stringify(forecastData));
    } else {
      throw new Error("City forcast not found");
    }
  } catch (err) {
    console.error(err);
    alert(err);
  }
  if (weatherData && forecastData) {
    location.href = "weather-info.html";
  } else {
    alert("Please enter a valid city name.");
  }
}
function weatherDataDisplay() {
  currentWeatherDataDisplay();
  forecastDataDisplay();
  //onload
  //Current Weather
  //Hourly Forcast
}

function currentWeatherDataDisplay() {
  weatherData = localStorage.getItem("weatherDataKey"); //this localStorage is used bc when we move onto another page, the previous data gets erased.
  weatherData = JSON.parse(weatherData); // this turns it back to the object
  console.log(weatherData);

  //time
  const timeZoneOfCity = getCityTime(weatherData.timezone * 1000);
  if (timeZoneOfCity >= 5 && timeZoneOfCity <= 11) {
    //morning
    new FinisherHeader({
      count: 6,
      size: {
        min: 1200,
        max: 2000,
        pulse: 0,
      },
      speed: {
        x: {
          min: 0.1,
          max: 0.3,
        },
        y: {
          min: 0.1,
          max: 0.3,
        },
      },
      colors: {
        background: "#8fdfeb",
        particles: ["#99a093", "#c0c9b8", "#e6b15d", "#99a093", "#8cc6ec"],
      },
      blending: "overlay",
      opacity: {
        center: 0.8,
        edge: 0,
      },
      skew: 0,
      shapes: ["c"],
    });
  } else if (timeZoneOfCity >= 12 && timeZoneOfCity <= 17) {
    //afternoon
    new FinisherHeader({
      count: 12,
      size: {
        min: 1300,
        max: 1500,
        pulse: 0.6,
      },
      speed: {
        x: {
          min: 1.8,
          max: 2.4,
        },
        y: {
          min: 1.9,
          max: 2.3,
        },
      },
      colors: {
        background: "#8fdfeb",
        particles: ["#40a0e0", "#c5e2f5", "#205070"],
      },
      blending: "lighten",
      opacity: {
        center: 0.6,
        edge: 0,
      },
      skew: 0,
      shapes: ["c"],
    });
  } else if (timeZoneOfCity >= 18 && timeZoneOfCity <= 20) {
    //evening
    new FinisherHeader({
      count: 6,
      size: {
        min: 1100,
        max: 1300,
        pulse: 0,
      },
      speed: {
        x: {
          min: 0.1,
          max: 0.3,
        },
        y: {
          min: 0.1,
          max: 0.3,
        },
      },
      colors: {
        background: "#c0c9b8",
        particles: ["#e6b15d", "#FF8866"],
      },
      blending: "overlay",
      opacity: {
        center: 0.85,
        edge: 0,
      },
      skew: 0,
      shapes: ["c"],
    });
  } else if (
    (timeZoneOfCity >= 0 && timeZoneOfCity < 5) ||
    timeZoneOfCity >= 21
  ) {
    //night
    new FinisherHeader({
      count: 100,
      size: {
        min: 2,
        max: 8,
        pulse: 0,
      },
      speed: {
        x: {
          min: 0,
          max: 0.2,
        },
        y: {
          min: 0,
          max: 0.2,
        },
      },
      colors: {
        background: "#271b38",
        particles: ["#fbfcca", "#d7f3fe", "#ffd0a7", "#ffffff"],
      },
      blending: "overlay",
      opacity: {
        center: 1,
        edge: 0,
      },
      skew: 0,
      shapes: ["c"],
    });
  }
  setCityName(weatherData.name);
  // setCityCurrentDate(weatherData.timezone * 1000);
  setCityTemp(weatherData.main.temp);
  setMinMaxTemp(weatherData.main.temp_min, weatherData.main.temp_max);
  setWeatherDescription(weatherData.weather[0].description);
  setWeatherIcon(weatherData.weather[0].icon);
  setHumidity(weatherData.main.humidity);
  setWindSpeed(weatherData.wind.speed);
  setFeelsLike(weatherData.main.feels_like);
}
function forecastDataDisplay() {
  forecastData = localStorage.getItem("forecastDataKey");
  forecastData = JSON.parse(forecastData);
  console.log(forecastData);

  //make all the rows
  let i = 0;
  while (new Date(forecastData.list[i].dt_txt).getHours() !== 0) {
    i++;
  }
  //row 1---------------------------------------------------------->
  const dateOfDisplay1 = dateFormat(forecastData.list[i].dt_txt);

  const forecastDisplay1 = document.getElementById("forecastDisplay1");
  forecastDisplay1.innerHTML += `
    <div class="date-and-max-min-temp">
      <p>${dateOfDisplay1}</p>  
      <p>${getMaxMinTemp(i)}</p>
    </div>
 `;
  let firstWeatherDisplayString = "";
  let hourCount = 0;
  for (let j = i; j < i + 8; j++) {
    firstWeatherDisplayString += `
        <div class="hourlyBoxWeatherInfo" id="weather-box-${hourCount}">
          <p>${titleCase(forecastData.list[j].weather[0].description)}</p>
          <img src=" https://openweathermap.org/img/wn/${
            forecastData.list[j].weather[0].icon
          }@2x.png"/>
          <p>${toCelcius(forecastData.list[j].main.temp)}</p>
          <p class="time-display-3hrs">${formatTime(
            forecastData.list[j].dt_txt
          )}</p>
        </div>
    `;
    hourCount += 3;
  }
  forecastDisplay1.innerHTML += `
    <div class="DateWeatherDisplay"> ${firstWeatherDisplayString} </div>
  `;
  //row 2---------------------------------------------------------->
  const dateOfDisplay2 = dateFormat(forecastData.list[i + 8].dt_txt);
  const forecastDisplay2 = document.getElementById("forecastDisplay2");
  forecastDisplay2.innerHTML = `
    <div class="date-and-max-min-temp">
      <p>${dateOfDisplay2}</p>  
      <p>${getMaxMinTemp(i + 8)}</p>
    </div>
  `;
  let secondWeatherDisplayString = "";
  for (let j = i + 8; j < i + 16; j++) {
    secondWeatherDisplayString += `
        <div class="hourlyBoxWeatherInfo">
          <p>${titleCase(forecastData.list[j].weather[0].description)}</p>
          <img src=" https://openweathermap.org/img/wn/${
            forecastData.list[j].weather[0].icon
          }@2x.png"/>
          <p>${toCelcius(forecastData.list[j].main.temp)}</p>
          <p class="time-display-3hrs">${formatTime(
            forecastData.list[j].dt_txt
          )}</p>
        </div>
    `;
  }
  forecastDisplay2.innerHTML += `
    <div class="DateWeatherDisplay"> ${secondWeatherDisplayString} </div>
  `;
  //row 3---------------------------------------------------------->
  const dateOfDisplay3 = dateFormat(forecastData.list[i + 16].dt_txt);
  const forecastDisplay3 = document.getElementById("forecastDisplay3");
  forecastDisplay3.innerHTML += `
    <div class="date-and-max-min-temp">
      <p>${dateOfDisplay3}</p>  
      <p>${getMaxMinTemp(i + 16)}</p>
    </div>`;
  let thirdWeatherDisplayString = "";
  for (let j = i + 16; j < i + 24; j++) {
    thirdWeatherDisplayString += `
    <div class="hourlyBoxWeatherInfo">
          <p>${titleCase(forecastData.list[j].weather[0].description)}</p>
          <img src=" https://openweathermap.org/img/wn/${
            forecastData.list[j].weather[0].icon
          }@2x.png"/>
          <p>${toCelcius(forecastData.list[j].main.temp)}</p>
          <p class="time-display-3hrs">${formatTime(
            forecastData.list[j].dt_txt
          )}</p>
        </div>
    `;
  }
  forecastDisplay3.innerHTML += `<div class="DateWeatherDisplay">${thirdWeatherDisplayString}</div>`;
  //row ends
  const leftBox = document.getElementById("weather-box-0");
  let leftGap = leftBox.getBoundingClientRect().left;
  let gridHeaders = document.getElementsByClassName("date-and-max-min-temp");
  for (let element of gridHeaders) {
    element.style.paddingLeft = `${leftGap}px`;
    element.style.paddingRight = `${leftGap}px`;
  }
}

//Forecast Weather
function getDayName(day) {
  const dayMap = new Map([
    [0, "Sunday"],
    [1, "Monday"],
    [2, "Tuesday"],
    [3, "Wednesday"],
    [4, "Thursday"],
    [5, "Friday"],
    [6, "Saturday"],
  ]);
  return dayMap.get(day) || null;
}
function getMonthName(month) {
  const monthMap = new Map([
    [0, "January"],
    [1, "February"],
    [2, "March"],
    [3, "April"],
    [4, "May"],
    [5, "June"],
    [6, "July"],
    [7, "August"],
    [8, "September"],
    [9, "October"],
    [10, "November"],
    [11, "December"],
  ]);
  return monthMap.get(month) || null;
}
function formatToTwoDigits(numOfDayOrMonth) {
  return numOfDayOrMonth <= 9 ? `0${numOfDayOrMonth}` : numOfDayOrMonth;
}
function getCityCurrentDate(timezone) {
  return dateFormat(new Date(Date.now() + timezone));
}
function dateFormat(date) {
  const rawDate = new Date(date);
  return `${getDayName(rawDate.getUTCDay())}, \u00A0${getMonthName(
    rawDate.getUTCMonth()
  )} \u00A0${formatToTwoDigits(
    rawDate.getUTCDate()
  )}, \u00A0${rawDate.getUTCFullYear()}`;
}
function toCelcius(temp) {
  return `${Math.trunc(temp - 273.15)}\u00B0C`;
}
function getWindSpeed(speed) {
  return `${Math.trunc(speed * 3.6)}km/h`;
}
function formatTime(date) {
  const time = new Date(date).getHours();
  if (time === 0) {
    return "12:00am";
  } else if (time >= 1 && time <= 11) {
    return `${formatToTwoDigits(time)}:00am`;
  } else {
    if (time === 12) {
      return `${time}:00pm`;
    } else {
      return `${formatToTwoDigits(time - 12)}:00pm`;
    }
  }
}
function getMaxMinTemp(index) {
  let maxTemp = forecastData.list[index].main.temp_max;
  let minTemp = forecastData.list[index].main.temp_min;
  for (let i = index + 1; i < index + 8; i++) {
    let tempMaxTemp = forecastData.list[i].main.temp_max;
    let tempMinTemp = forecastData.list[i].main.temp_min;
    if (maxTemp < tempMaxTemp) {
      maxTemp = tempMaxTemp;
    }
    if (minTemp > tempMinTemp) {
      minTemp = tempMinTemp;
    }
  }
  return `H: ${toCelcius(maxTemp)} L: ${toCelcius(minTemp)}`;
}

//Current Weather
function setCityName(name) {
  const cityName = document.getElementById("cityName");
  cityName.textContent = name;
}
function titleCase(sentence) {
  let str = "";
  str += sentence[0].toUpperCase();
  for (let i = 1; i < sentence.length - 1; i++) {
    if (sentence[i] === " ") {
      str += sentence[i];
      str += sentence[i + 1].toUpperCase();
      i++;
    } else {
      str += sentence[i];
    }
  }
  str += sentence[sentence.length - 1];
  return str;
}
function getCityTime(timeZone) {
  return new Date(Date.now() + timeZone).getUTCHours();
}
function setWindSpeed(speed) {
  const windSpeed = document.getElementById("windSpeed");
  const windSpeedInKm = Math.trunc(speed * 3.6);
  windSpeed.textContent = windSpeedInKm + " km";
}
function setWeatherIcon(iconID) {
  const weatherIconDisplay = document.getElementById("weatherIcon");
  const weatherIconURL = ` https://openweathermap.org/img/wn/${iconID}@2x.png`;
  weatherIconDisplay.src = weatherIconURL;
}
function setMinMaxTemp(min, max) {
  const MaxMinTemps = document.getElementById("max-min-temp");
  let maxTemp = Math.trunc(max - 273.15);
  let minTemp = Math.trunc(min - 273.15);
  MaxMinTemps.textContent =
    "H: " + maxTemp + "\u00B0C \u00A0" + " L: " + minTemp + "\u00B0C";
}
function setWeatherDescription(description) {
  const weatherDescription = document.getElementById("weatherDescription");
  weatherDescription.textContent = titleCase(description);
}
function setHumidity(humidity) {
  const cityHumidity = document.getElementById("humidity");
  cityHumidity.textContent = humidity + "%";
}
function setCityTemp(temp) {
  const cityTemp = document.getElementById("cityTemp");
  let celsius = Math.trunc(temp - 273.15);
  cityTemp.textContent = celsius + "\u00B0C";
}
function setFeelsLike(temp) {
  const feelsLike = document.getElementById("feelsLike");
  let feelsLikeCelsius = Math.trunc(temp - 273.15);
  feelsLike.textContent = feelsLikeCelsius + "\u00B0C";
}
function setCityCurrentDate(date) {
  document.getElementById("currentDate").textContent = getCityCurrentDate(date);
}
window.onresize = () => {
  const leftBox = document.getElementById("weather-box-0");
  let leftGap = leftBox.getBoundingClientRect().left;
  let gridHeaders = document.getElementsByClassName("date-and-max-min-temp");
  for (let element of gridHeaders) {
    element.style.paddingLeft = `${leftGap}px`;
    element.style.paddingRight = `${leftGap}px`;
  }
};
