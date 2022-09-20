const loader = document.querySelector(".loader");
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (location) => {
      const long = location.coords.longitude;
      const latitude = location.coords.latitude;
      console.log(location, long, latitude);
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
    console.log(dataForecast);
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

    console.log(data.weather[0].description);
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
    console.log(Math.trunc(dataForecast.list[index * 3].main.temp));
  });
}
