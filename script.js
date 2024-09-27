const coordinates = {
    "Tacloban": { lat: 11.24333, lon: 125.00472 },
    "Ormoc": { lat: 11.00639, lon: 124.6075 },
    "Baybay": { lat: 10.6833, lon: 124.8333 },
    "Albuera": { lat: 10.916663, lon: 124.6999972 },
    "Palo": { lat: 11.1600, lon: 124.9901 },
    "Bato": { lat: 10.3268, lon: 124.791 },
    "Isabel": { lat: 10.9270, lon: 124.4350 },
    "Dulag": { lat: 10.9530, lon: 125.0320 }
};

const apiKey = '9cba046be94ecf2e59f0b6db13402d03';

const currentDateTxt = document.querySelector('.current-date-txt');
const locationTxt = document.querySelector('.location-txt');
const tempTxt = document.querySelector('.temp-txt');
const conditionTxt = document.querySelector('.condition-txt');
const humidityTxt = document.querySelector('.humidity-value');
const windValueTxt = document.querySelector('.wind-speed-value');
const weatherImg = document.querySelector('.weather-img');
const forecastItemsContainer = document.querySelector('.weather-forecast-items-container');

async function fetchWeatherData(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}

async function fetchForecastData(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}

function updateWeatherDetails(data) {
    const { name, main: { temp, humidity }, weather: [{ id, main }], wind: { speed } } = data;
    tempTxt.textContent = `${Math.round(temp)} °C`;
    conditionTxt.textContent = main;
    humidityTxt.textContent = `${humidity}%`;
    windValueTxt.textContent = `${speed} m/s`;
    locationTxt.textContent = name;
    weatherImg.src = `weather/${getWeatherIcon(id)}`;
}

async function updateForecastInfo(name) {
    const { lat, lon } = coordinates[name];
    const forecastsData = await fetchForecastData(lat, lon);
    const timeTaken = '12:00:00';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    forecastItemsContainer.innerHTML = '';
    let count = 0;
    forecastsData.list.forEach(forecastsWeather => {
        const forecastDate = new Date(forecastsWeather.dt_txt);
        forecastDate.setHours(0, 0, 0, 0);
        if (forecastsWeather.dt_txt.includes(timeTaken) && forecastDate > today && count < 4) {
            updateForecastItems(forecastsWeather);
            count++;
        }
    });
}

function updateForecastItems(weatherData) {
    const { dt_txt: date, weather: [{ id }], main: { temp } } = weatherData;
    const dateTaken = new Date(date);
    const dateOption = { day: '2-digit', month: 'short' };
    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption);
    const forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date">${dateResult}</h5>
            <img src="weather/${getWeatherIcon(id)}">
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>
    `;
    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem);
}

function getWeatherIcon(id) {
    if (id >= 200 && id <= 232) return 'thunderstorm.svg'; 
    if (id >= 300 && id <= 321) return 'drizzle.svg';      
    if (id >= 500 && id <= 531) return 'rain.svg';         
    if (id === 800) return 'clear.svg';                    
    if (id >= 801 && id <= 804) return 'clouds.svg';      
    return 'clouds.svg';                                     
}

function getCurrentDate() {
    const currentDate = new Date();
    const options = { weekday: 'short', day: '2-digit', month: 'short' };
    return currentDate.toLocaleDateString('en-GB', options);
}

async function handleGetWeather() {
    const selectedLocation = document.getElementById('selectedLocation').value;
    if (selectedLocation) {
        const { lat, lon } = coordinates[selectedLocation];
        const weatherData = await fetchWeatherData(lat, lon);
        updateWeatherDetails(weatherData);
        await updateForecastInfo(selectedLocation);
        currentDateTxt.textContent = getCurrentDate();

        document.getElementById('box-2').style.display = 'grid';
    } else {
        alert('Please select a location!');
    }
}


document.querySelector('.btn').addEventListener('click', handleGetWeather);
