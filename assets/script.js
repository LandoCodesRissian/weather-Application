const apiKey = 'ff6a5f180fbc5f515345227aeee3013f';
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeatherSection = document.getElementById('current-weather');

searchForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const cityName = cityInput.value;

    // Make an API request to get current weather data
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            // Display current weather data in currentWeatherSection
            console.log(data)
            // Extract and format the relevant information
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});