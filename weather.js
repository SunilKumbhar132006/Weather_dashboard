// Weather Dashboard - Open-Meteo API Implementation

// DOM Elements
const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const loadingElement = document.getElementById("loading");
const errorMessage = document.getElementById("error-message");
const weatherResults = document.getElementById("weather-results");

// Weather Code Interpretation Map (WMO Weather interpretation codes)
const getWeatherDetails = (code) => {
  const weatherMap = {
    0: { description: "Clear sky", icon: "☀️" },
    1: { description: "Mainly clear", icon: "🌤️" },
    2: { description: "Partly cloudy", icon: "⛅" },
    3: { description: "Overcast", icon: "☁️" },
    45: { description: "Foggy", icon: "🌫️" },
    48: { description: "Depositing rime fog", icon: "🌫️" },
    51: { description: "Light drizzle", icon: "🌦️" },
    53: { description: "Moderate drizzle", icon: "🌦️" },
    55: { description: "Dense drizzle", icon: "🌧️" },
    56: { description: "Light freezing drizzle", icon: "🌧️" },
    57: { description: "Dense freezing drizzle", icon: "🌧️" },
    61: { description: "Slight rain", icon: "🌦️" },
    63: { description: "Moderate rain", icon: "🌧️" },
    65: { description: "Heavy rain", icon: "🌧️" },
    66: { description: "Light freezing rain", icon: "🌧️" },
    67: { description: "Heavy freezing rain", icon: "🌧️" },
    71: { description: "Slight snow fall", icon: "🌨️" },
    73: { description: "Moderate snow fall", icon: "🌨️" },
    75: { description: "Heavy snow fall", icon: "❄️" },
    77: { description: "Snow grains", icon: "❄️" },
    80: { description: "Slight rain showers", icon: "🌦️" },
    81: { description: "Moderate rain showers", icon: "🌧️" },
    82: { description: "Violent rain showers", icon: "⛈️" },
    85: { description: "Slight snow showers", icon: "🌨️" },
    86: { description: "Heavy snow showers", icon: "❄️" },
    95: { description: "Thunderstorm", icon: "⛈️" },
    96: { description: "Thunderstorm with slight hail", icon: "⛈️" },
    99: { description: "Thunderstorm with heavy hail", icon: "⛈️" }
  };

  return weatherMap[code] || { description: "Unknown condition", icon: "🌡️" };
};

// UI State Functions
const showLoading = () => {
  loadingElement.classList.remove("hidden");
};

const hideLoading = () => {
  loadingElement.classList.add("hidden");
};

// Function: Show friendly error messages
const showError = (message) => {
  weatherResults.classList.add("hidden");
  weatherResults.innerHTML = "";
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
};

const hideError = () => {
  errorMessage.textContent = "";
  errorMessage.classList.add("hidden");
};

// Function: Display weather data using dynamic DOM manipulation
const displayWeatherData = (cityInfo, weatherData) => {
  weatherResults.innerHTML = "";

  const { name, country } = cityInfo;
  const { current, daily, current_units } = weatherData;
  const { temperature_2m, wind_speed_10m, weather_code } = current;
  const tempUnit = current_units?.temperature_2m || "°C";
  const windUnit = current_units?.wind_speed_10m || "km/h";
  const currentCondition = getWeatherDetails(weather_code);

  // 1. Create Current Weather Card dynamically
  const currentCard = document.createElement("div");
  currentCard.className = "current-card";

  const currentInfo = document.createElement("div");
  currentInfo.className = "current-info";

  const cityHeading = document.createElement("h2");
  cityHeading.textContent = country ? `${name}, ${country}` : name;

  const datePara = document.createElement("p");
  datePara.className = "date";
  datePara.textContent = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const weatherDesc = document.createElement("p");
  weatherDesc.className = "weather-desc";
  weatherDesc.textContent = currentCondition.description;

  const windSpeedPara = document.createElement("p");
  windSpeedPara.className = "wind-speed";
  windSpeedPara.textContent = `Wind Speed: ${wind_speed_10m} ${windUnit}`;

  currentInfo.appendChild(cityHeading);
  currentInfo.appendChild(datePara);
  currentInfo.appendChild(weatherDesc);
  currentInfo.appendChild(windSpeedPara);

  const currentTempBox = document.createElement("div");
  currentTempBox.className = "current-temp-box";

  const currentIcon = document.createElement("div");
  currentIcon.className = "current-icon";
  currentIcon.textContent = currentCondition.icon;

  const currentTemp = document.createElement("div");
  currentTemp.className = "current-temp";
  currentTemp.textContent = `${Math.round(temperature_2m)}${tempUnit}`;

  currentTempBox.appendChild(currentIcon);
  currentTempBox.appendChild(currentTemp);

  currentCard.appendChild(currentInfo);
  currentCard.appendChild(currentTempBox);

  // 2. Create Forecast Section dynamically
  const forecastSection = document.createElement("section");
  forecastSection.className = "forecast-section";

  const forecastHeading = document.createElement("h3");
  forecastHeading.textContent = "5-Day Forecast";
  forecastSection.appendChild(forecastHeading);

  const forecastCardsContainer = document.createElement("div");
  forecastCardsContainer.className = "forecast-cards";

  // Forecast for upcoming days
  const { time, weather_code: dailyCodes, temperature_2m_max, temperature_2m_min } = daily;
  const startIndex = time.length > 5 ? 1 : 0;
  const count = Math.min(5, time.length - startIndex);

  for (let i = startIndex; i < startIndex + count; i++) {
    const dayDate = new Date(`${time[i]}T00:00:00`);
    const formattedDate = dayDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric"
    });
    const condition = getWeatherDetails(dailyCodes[i]);
    const maxTemp = Math.round(temperature_2m_max[i]);
    const minTemp = Math.round(temperature_2m_min[i]);

    const card = document.createElement("div");
    card.className = "forecast-card";

    const dateElem = document.createElement("div");
    dateElem.className = "forecast-date";
    dateElem.textContent = formattedDate;

    const iconElem = document.createElement("div");
    iconElem.className = "forecast-icon";
    iconElem.textContent = condition.icon;

    const descElem = document.createElement("div");
    descElem.className = "forecast-desc";
    descElem.textContent = condition.description;

    const tempElem = document.createElement("div");
    tempElem.className = "forecast-temp";

    const maxSpan = document.createElement("span");
    maxSpan.className = "max";
    maxSpan.textContent = `High: ${maxTemp}°`;

    const minSpan = document.createElement("span");
    minSpan.className = "min";
    minSpan.textContent = `Low: ${minTemp}°`;

    tempElem.appendChild(maxSpan);
    tempElem.appendChild(minSpan);

    card.appendChild(dateElem);
    card.appendChild(iconElem);
    card.appendChild(descElem);
    card.appendChild(tempElem);

    forecastCardsContainer.appendChild(card);
  }

  forecastSection.appendChild(forecastCardsContainer);

  weatherResults.appendChild(currentCard);
  weatherResults.appendChild(forecastSection);
  weatherResults.classList.remove("hidden");
};

// Function: Fetch weather data using Fetch API, async/await, and error handling
const fetchWeatherData = async (cityName) => {
  // Check internet connectivity
  if (!navigator.onLine) {
    showError("No internet connection. Please check your network and try again.");
    return;
  }

  hideError();
  weatherResults.classList.add("hidden");
  showLoading();

  try {
    // 1. Geocoding API: Convert city name to latitude and longitude
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
    const geoResponse = await fetch(geoUrl);

    if (!geoResponse.ok) {
      throw new Error(`Geocoding request failed with status ${geoResponse.status}`);
    }

    const geoData = await geoResponse.json();

    // Handle city not found
    if (!geoData.results || geoData.results.length === 0) {
      showError(`City "${cityName}" not found. Please check the spelling and try again.`);
      return;
    }

    const cityInfo = geoData.results[0];
    const { latitude, longitude } = cityInfo;

    // 2. Forecast API: Get current weather and 5-day forecast
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      throw new Error(`Weather data request failed with status ${weatherResponse.status}`);
    }

    const weatherData = await weatherResponse.json();

    // Display the weather data
    displayWeatherData(cityInfo, weatherData);
  } catch (error) {
    if (!navigator.onLine || error.message.includes("Failed to fetch") || error.name === "TypeError") {
      showError("No internet connection. Please check your network and try again.");
    } else {
      showError(error.message || "An unexpected error occurred while fetching weather data.");
    }
  } finally {
    hideLoading();
  }
};

// Event listener for search form submission (supports button click & Enter key)
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const cityName = cityInput.value.trim();

  // Handle empty input
  if (!cityName) {
    showError("Please enter a city name.");
    return;
  }

  fetchWeatherData(cityName);
});

