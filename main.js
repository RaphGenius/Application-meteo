const loader = document.querySelector(".loader");
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (location) => {
      const long = location.coords.longitude;
      const latitude = location.coords.latitude;
      getWeatherData(long, latitude);
      getForecastWeatherData(long, latitude);
    },
    () => {
      loader.textContent =
        "Vous avez refusez la géolocalisation, l'application ne peut pas fonctionner.";
    }
  );
}
//Donnée de prévision
async function getForecastWeatherData(long, latitude) {
  try {
    const resultsForecast = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${long}&lang=fr&units=metric&appid=150dcb455a3497c432d9faf1e3e7dcf5`
    );
    if (!resultsForecast.ok) {
      console.log("erreur du forecast");
    }
    const dataForecast = await resultsForecast.json();
    handleHour(dataForecast);
    handleDays(dataForecast.list);
  } catch (error) {
    loader.textContent = error;
  }
}
// Temps actuel
async function getWeatherData(long, latitude) {
  try {
    const results = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${long}&lang=fr&units=metric&appid=150dcb455a3497c432d9faf1e3e7dcf5`
    );
    if (!results.ok) {
      console.log(results);
      throw new Error(`Erreur : ${results}`);
    }
    const data = await results.json();
    console.log(data);
    populateMainInfo(data);

    loader.classList.add("fade-out");
  } catch (error) {
    loader.textContent = error;
  }
}

const position = document.querySelector(".position");
const temperature = document.querySelector(".temperature");
const weatherImage = document.querySelector(".weather-logo");
const currentHour = new Date().getHours();
function populateMainInfo(data) {
  temperature.textContent = `${Math.trunc(data.main.temp)}°`;
  position.textContent = data.name;

  if (currentHour >= 6 && currentHour < 21) {
    weatherImage.src = `ressources/jour/${data.weather[0].icon}.svg`;
  } else {
    weatherImage.src = `ressources/nuit/${data.weather[0].icon}.svg`;
  }
}

const hourNameBlocks = document.querySelectorAll(".hour-name");
const hourTempartures = document.querySelectorAll(".hour-temp");
function handleHour(dataForecast) {
  hourNameBlocks.forEach((block, index) => {
    const incrementedHour = currentHour + index * 3;
    if (incrementedHour > 24) {
      const calcul = incrementedHour - 24;
      hourNameBlocks[index].textContent = `${calcul === 24 ? "00" : calcul}h`;
    } else if (incrementedHour === 24) {
      hourNameBlocks[index].textContent = "00h";
    } else {
      hourNameBlocks[index].textContent = `${incrementedHour}h`;
    }
    hourTempartures[index].textContent = `${Math.trunc(
      dataForecast.list[index].main.temp
    )}°`;
  });
}

const weekDays = [
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
  "dimanche",
];
const currentDay = new Date().toLocaleDateString("fr-FR", { weekday: "long" });

//Permet de couper le tableau depuis le jour d'aujoud'hui  + 1 pour ne pas avoir le nom du jour
// .concat permet d'additionner plusieurs tableaux
const forecastDays = weekDays
  .slice(weekDays.indexOf(currentDay) + 1)
  .concat(weekDays.slice(0, weekDays.indexOf(currentDay) + 1));
// console.log(`Current day : ${currentDay} et orderedDays = ${orderedDays}`);

const daysName = document.querySelectorAll(".day-name");
const perDayTemperature = document.querySelectorAll(".day-temp");

function handleDays(data) {
  forecastDays.forEach((day, index) => {
    daysName[index].textContent =
      forecastDays[index].charAt(0).toUpperCase() +
      forecastDays[index].slice(1, 3);
  });
}
