/** Updates the current date and day in the header. */
function updateDate() {
  const now = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const formattedDate = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  document.getElementById("currentDay").innerHTML = days[now.getDay()];
  document.getElementById("currentDate").innerHTML = formattedDate;
}
updateDate();

// --- API Configuration / We will use this information in the next session, just make sure to create your account
//  and activate your API key - This is the website : https://openweathermap.org/ ---
const API_KEY = "7a1d67bc301050fca55a1954480b88e1"; // IMPORTANT: Replace with your key! 7a1d67bc301050fca55a1954480b88e1
//FES key = f52c8dd32a967318ffed29b79ebc8acc
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// --- DOM Element References ---
const cityInputElement = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");
const cityNameElement = document.getElementById("city-name");
const weatherIconElement = document.getElementById("weather-emoji");
const temperatureElement = document.querySelector(".temperature");
const conditionElement = document.querySelector(".condition");
const messageBox = document.getElementById("message-box");
const messageText = document.getElementById("message-text");

/** Displays a message box with dynamic styling. */
function showMessage(message, type = "info") {
  messageText.innerHTML = message;
  const styles =
    {
      success: { bg: "#1a532e", border: "#3cba54", text: "#c8e6c9" },
      error: { bg: "#5c1818", border: "#d93025", text: "#fca7a7" },
      warning: { bg: "#5e4d00", border: "#fbbc05", text: "#ffe082" },
      info: { bg: "#0b3d63", border: "#1a73e8", text: "#b3d4f8" },
    }[type] || styles.info; // Default to info

  messageBox.style.cssText = `
        background-color: ${styles.bg};
        border: 1px solid ${styles.border};
        color: ${styles.text};
        padding: 0.8rem 1.2rem; border-radius: 0.8rem; margin-bottom: 1.5rem;
        text-align: center; width: calc(100% - 20px); font-size: 0.95rem;
        font-weight: 500; transition: all 0.3s ease-in-out;
        margin-left: auto; margin-right: auto;
    `;
  messageBox.classList.remove("hidden");
  setTimeout(() => messageBox.classList.add("hidden"), 5000);
}

/** Handles city search input. */
function handleSearch() {
  // console.log('123')
  const city = cityInputElement.value.trim();
  if (!city) {
    showMessage("Please enter a city name.", "warning");
    return;
  }
  fetchWeatherFromAPI(city);
  // console.log(city)
}

// --- Event Listeners ---
searchButton.addEventListener("click", handleSearch);
cityInputElement.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSearch();
});

// -----------------
// VICTOR START HERE
// -----------------

// Start here...
//Fetches weather data from OpenWeatherMap API
async function fetchWeatherFromAPI(city) {
  if (!API_KEY) {
    showMessage(
      "Please get your OpenWeatherMap API Key and replace the placeholder.",
      "error"
    );
    return;
  }
  weatherIconElement.innerHTML = "Hourglass"; //Loading emoji

  try {
    const res = await fetch(
      `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`
    );
    if (!res.ok) {
      const msg =
        res.status === 404
          ? `City "${city}" not found.`
          : res.status === 401
          ? "Invalid API Key."
          : `Error: ${res.statusText}`;
      showMessage(msg, "error");
      cityNameElement.innerHTML = "Error";
      temperatureElement.innerHTML = "--°C";
      conditionElement.innerHTML = "N/A";
      weatherIconElement.innerHTML = "❓";
      return;
    }
    const data = await res.json();
    console.log(data);

    updateWeatherDisplay(data);
    showMessage(`Weather for ${data.name} fetched`, "success");
  } catch (error) {
    console.error("Fetch error:", error);
    showMessage("Failed to connect to weather service.", "error");
    cityNameElement.innerHTML = "Error";
    temperatureElement.innerHTML = "--°C";
    conditionElement.innerHTML = "N/A";
    weatherIconElement.innerHTML = "❗";
  }
}

//Updates weather display with API data using map() amd immerHTML
function updateWeatherDisplay(data) {
  const emojiMap = {
    "01d": "☀️", //clear sky
    "01n": "🌃",
    "02d": "⛅", //few clouds
    "02n": "☁️",
    "03d": "☁️", //scattered clouds
    "03n": "☁️",
    "04d": " overcast", //overcast
    "04n": " overcast",
    "09d": "☔", //shower rain
    "09n": "☔",
    "10d": "🌧️", //rain
    "10n": "🌧️",
    "11d": "⛈️", //thunderstorm
    "11n": "⛈️",
    "13d": "❄️", //snow
    "13n": "❄️",
    "50d": "🌫️", //mist
    "50n": "🌫️",
  };
  const weather = data.weather.map((w) => ({
    desc: w.description,
    icon: w.icon,
  }))[0]; //include [0] to say in advance only want info as object, not arrayed
  console.log(weather)

  cityNameElement.innerHTML = data.name;
  temperatureElement.innerHTML = `${Math.round(data.main.temp)}°C`;
  conditionElement.innerHTML = weather.desc;
  weatherIconElement.innerHTML = emojiMap[weather.icon] || "❓";
}
