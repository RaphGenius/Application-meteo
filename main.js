const loader = document.querySelector(".loader");

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (location) => {
      const long = location.coords.longitude;
      const latitude = location.coords.latitude;
      console.log(location, long, latitude);
      getWeatherData(long, latitude);
    },
    () => {
      loader.textContent =
        "Vous avez refusez la géolocalisation, l'application ne peut pas fonctionner.";
    }
  );
}

async function getWeatherData(long, latitude) {
  try {
    const results = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${long}&appid=12f3a215e8274b83bcafb225f7f11e31`
    );
    if (!results.ok) {
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
  temperature.textContent = `${Math.trunc(data.weather.temp)}`;
  position.textContent = data.timezone;

  if (currentHour >= 6 && currentHour < 21) {
    weatherImage.src = `ressources/jour/${data.weather[0].icon}.svg`;
  } else {
    weatherImage.src = `ressources/nuit/${data.weather[0].icon}.svg`;
  }
}
