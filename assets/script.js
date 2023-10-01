
const apiKey = "ff6a5f180fbc5f515345227aeee3013f";

document.getElementById("searchBtn").addEventListener("click", function () {
    const location = document.getElementById("location").value;

    
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            
            document.getElementById("locationName").textContent = data.city.name;
            
            
            const firstForecast = data.list[0];
            document.getElementById("temperature").textContent = firstForecast.main.temp;
            document.getElementById("condition").textContent = firstForecast.weather[0].description;
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
        });
});
