const apiKey = 'ff6a5f180fbc5f515345227aeee3013f';
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeatherSection = document.getElementById('current-weather');
const forecastSection = document.getElementById('forecast');
const searchHistoryList = document.getElementById('search-history');


searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const cityName = cityInput.value;

    // Fetch current weather data
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            // Display current weather data
            displayCurrentWeather(data);

            // Fetch and display the 5-day forecast
            fetchAndDisplayForecast(cityName);

            // Save city to search history
            saveToSearchHistory(cityName);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            // Display an error message to the user
            displayError('City not found. Please try again.');
        });
});

// Function to display current weather data
function displayCurrentWeather(data) {

    const cityName = data.name;
    const date = new Date(data.dt * 1000); 
    const temperature = (data.main.temp - 273.15).toFixed(2);
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const weatherIcon = data.weather[0].icon;
    const weatherDescription = data.weather[0].description;

    // Create HTML for current weather
    const currentWeatherHTML = `
        <h2>${cityName} (${date.toLocaleDateString()}) <img src="http://openweathermap.org/img/w/${weatherIcon}.png" alt="${weatherDescription}"></h2>
        <p>Temperature: ${temperature} °C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
    `;

    // Display current weather
    currentWeatherSection.innerHTML = currentWeatherHTML;
}

// Function to fetch and display the 5-day forecast
function fetchAndDisplayForecast(cityName) {
    // Make an API request to get the 5-day forecast data
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            // Extract and format the 5-day forecast data
            const forecastData = data.list;

            // Display the forecast data
            displayForecast(forecastData);
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
            // Display an error message to the user
            displayError('Forecast data not available.');
        });
}

// Function to display the 5-day forecast with only the high temperature
function displayForecast(forecastData) {
    forecastSection.innerHTML = '';
    const highTemperatures = {};
    // Loop through the forecast data and update the high temperature for each day
    forecastData.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dateKey = date.toLocaleDateString(); // Use the date as the key

        const temperature = (item.main.temp - 273.15).toFixed(2); // Convert to Celsius

        // If the date key doesn't exist in the highTemperatures object or if the current temperature is higher, update the high temperature
        if (!highTemperatures[dateKey] || temperature > highTemperatures[dateKey]) {
            highTemperatures[dateKey] = temperature;
        }
    });

    // Loop through the high temperatures and display them
    for (const dateKey in highTemperatures) {
        if (highTemperatures.hasOwnProperty(dateKey)) {
            const date = new Date(dateKey);
            const temperature = highTemperatures[dateKey];
            const forecastHTML = `
                <div class="forecast-item">
                    <p>Date: ${date.toLocaleDateString()}</p>
                    <p>High Temperature: ${temperature} °C</p>
                </div>
            `;
            forecastSection.innerHTML += forecastHTML;
        }
    }
}

// Function to handle errors and display messages
function displayError(message) {
    // Clear the existing error message
    currentWeatherSection.innerHTML = '';

    // Create an error message element
    const errorDiv = document.createElement('div');
    errorDiv.classList.add('error');
    errorDiv.textContent = message;

    // Append the error message to the currentWeatherSection
    currentWeatherSection.appendChild(errorDiv);
}

// Function to save city to search history
function saveToSearchHistory(cityName) {
    // Get existing search history from localStorage
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    // Add the new city to the search history
    searchHistory.push(cityName);

    searchHistory = [...new Set(searchHistory)];

    // Store the updated search history in localStorage
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

    // Display the updated search history
    displaySearchHistory(searchHistory);
}

// Function to display search history
function displaySearchHistory(searchHistory) {
    // Clear the existing search history
    searchHistoryList.innerHTML = '';
    searchHistory.forEach(city => {
        const listItem = document.createElement('li');
        listItem.textContent = city;
        listItem.classList.add('search-history-item');
        listItem.addEventListener('click', () => {
            cityInput.value = city;
            searchForm.dispatchEvent(new Event('submit'));
        });

        searchHistoryList.appendChild(listItem);
    });
}

// Initialize: Display search history on page load
const initialSearchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
displaySearchHistory(initialSearchHistory);
