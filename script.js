let cityInput = document.getElementById('city_input'),
searchBtn = document.getElementById('searchBtn'),
locationBtn = document.getElementById('locationBtn'),
api_key = 'b6356ed4fa9228b57cbafea3eaf2b4a1',
currentWeatherCard = document.querySelectorAll('.weather-left .card')[0];
fiveDaysForecast= document.querySelector('.day-forecast');
aqicard= document.querySelectorAll('.highlights .card')[0],
sunrisecard = document.querySelectorAll('.highlights .card')[1],
pressureVal = document.getElementById('pressureVal');
humidityVal = document.getElementById('humidityVal');
windspeedVal = document.getElementById('windspeedVal');
visibilityVal = document.getElementById('visibilityVal');
feelsVal = document.getElementById('feelsVal');
hourlyForecastCard = document.querySelector('.hourly-forecast');
aqilist = ['Good','Fair','Moderate','Poor','Very Poor'];

function getweatherDetails(name, lat, lon, country, state) {
    let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`,
    WEATHER_API_URL  = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;
    AIR_POLLUTION_API_URL=`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`
        days = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ],
        months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ];

    fetch(AIR_POLLUTION_API_URL).then(res => res.json()).then(data => {
        let {co,no,no2,o3,so2,pm2_5,pm10,nh3}=data.list[0].components;
        aqicard.innerHTML = `
        <div class="card-head">
            <p>Air Quality Index</p>
            <p class="air-index aqi-${data.list[0].main.aqi}">${aqilist[data.list[0].main.aqi - 1]}</p>
        </div>
        <div class="air-indices">
            <i class="fa-regular fa-wind fa-3x"></i>
        <div class="item">
            <p>PM2.5</p>
            <h2>${pm2_5}</h2>
        </div>
        <div class="item">
            <p>PM10</p>
            <h2>${pm10}</h2>
        </div>
        <div class="item">
            <p>SO2</p>
            <h2>${so2}</h2>
        </div>
        <div class="item">
            <p>CO</p>
            <h2>${co}</h2>
        </div>
        <div class="item">
            <p>NO</p>
            <h2>${no}</h2>
        </div>
        <div class="item">
            <p>NO2</p>
            <h2>${no2}</h2>
        </div>
        <div class="item">
            <p>NH3</p>
            <h2>${nh3}</h2>
        </div>
        <div class="item">
            <p>O3</p>
            <h2>${o3}</h2>
        </div>
    </div>
        `;
    }).catch(() => {
        alert("Failed to fetch air quality index");
    });

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
    let date = new Date();
    currentWeatherCard.innerHTML = `
        <div class="current-weather">
            <div class="details">
                <p>Now</p>
                <h2>${(data.main.temp - 273.15).toFixed(2)}</h2>
                <p>${data.weather[0].description}</p>
            </div>
                <div class="weather-icon">
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather Icon">
                </div>
            </div>
            <hr>
            <div class="card-footer">
                <p><i class="fa-light fa-calendar"></i> ${days[date.getDay()]}, ${date.getDate()}, ${months[date.getMonth()]} ${date.getFullYear()}</p>
                <p><i class="fa-light fa-location-dot"></i> ${name}, ${country}</p>
            </div>
        `;
        let {sunrise, sunset} = data.sys,
        {timezone , visibility} = data,
        {humidity, pressure, feels_like} = data.main,
        {speed} = data.wind,
        sRiseTime = moment.utc(sunrise,'X').add(timezone,'seconds').format('hh:mm A'),
        ssetTime = moment.utc(sunset,'X').add(timezone,'seconds').format('hh:mm A');
        sunrisecard.innerHTML = `
        <div class="card-head">
            <p>sunrise-sunset</p>
        </div>
        <div class="sunrise-sunset">
            <div class="item">
                <div class="icon">
                    <i class="fa-light fa-sunrise fa-4x"></i>
                </div>
                <div>
                    <p>sunrise</p>
                    <h2>${sRiseTime}</h2>
                </div>
            </div>
            <div class="item">
                <div class="icon">
                    <i class="fa-light fa-sunset fa-4x"></i>
                </div>
                <div>
                    <p>sunset</p>
                    <h2>${ssetTime}</h2>
                </div>
            </div>
        </div>
        `;
        humidityVal.innerHTML = `${humidity} %`;
        pressureVal.innerHTML = `${pressure} hPa`;
        windspeedVal.innerHTML = `${speed} m/s`;
        visibilityVal.innerHTML = `${(visibility/1000).toFixed(2)} km`;
        feelsVal.innerHTML = `${(feels_like - 273.15).toFixed(2)} &deg;C`;
    }).catch(() => {
        alert('Failed to fetch current weather');
    });

    fetch(FORECAST_API_URL).then(res => res.json()).then(data => {
        let hourlyForecast = data.list;
        hourlyForecastCard.innerHTML = ``
        for(i=0; i <= 7; i++){
            let hrForeCastDate = new Date(hourlyForecast[i].dt_txt);
            let hr = hrForeCastDate.getHours();
            let a = 'PM';
            if(hr < 12) a = 'AM';
            if(hr == 0) hr = 12;
            if(hr > 12) hr = hr - 12;
            hourlyForecastCard.innerHTML += `
            <div class="card">
                <p>${hr} ${a}</p>
                <img src="https://openweathermap.org/img/wn/${hourlyForecast[i].weather[0].icon}" alt="">
                    <p>${(hourlyForecast[i].main.temp -273.15).toFixed(2)}&deg;C</p>
            </div>`
            ;
        }
        let uniqueForecastDays = [];
        let fiveDaysForecastData = data.list.filter(forecast =>{
            let forecastDate =  new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate);
            }
        });
        console.log(fiveDaysForecastData);
        fiveDaysForecast.innerHTML= '';
        for(let i =1;i < fiveDaysForecastData.length; i++){
            let date=new Date(fiveDaysForecastData[i].dt_txt);
            fiveDaysForecast.innerHTML += `
                <div class="Forecast-Item">
                    <div class="Icon-Wrapper">
                        <img src="https://openweathermap.org/img/wn/${fiveDaysForecastData[i].weather[0].icon}.png" alt="${fiveDaysForecastData[i].weather[0].description}">
                        <span>${(fiveDaysForecastData[i].main.temp - 273.15).toFixed(2)}&deg;C</span>
                    </div>
                    <p>${date.getDate()} ${months[date.getMonth()]}</p>
                    <p>${days[date.getDay()]}</p>
                </div>
    `;
    }
    }).catch(() => {
        alert('Failed to fetch weather forecast');
    });
}

function getCityCoordinates(){
    let cityName=cityInput.value.trim();
    cityInput.value='';
    if(!cityName) return;
    let GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
    let {name, lat, lon, country, state} = data[0];
    getweatherDetails(name, lat, lon, country, state);
    }).catch(() => {
        alert(`Failed to fetch coordinates of ${cityName}`);
    });
}

function getUsercoordinates(){
    navigator.geolocation.getCurrentPosition(position => {
        let {latitude, longitude} = position.coords;
        let REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`;
        
        fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data =>{
            let {name, country, state}=data[0];
            getweatherDetails(name, latitude, longitude,country, state);
        }).catch(() => {
            alert('Failed to fetch user Coordinates')
        })
    },error =>{
        if(error.code === error.PERMISSION_DENIED){
            alert('Geolocation permission denied.please grant permissison');
        }
    });
}

searchBtn.addEventListener('click', getCityCoordinates);
locationBtn.addEventListener('click', getUsercoordinates);
cityInput.addEventListener('keyup', e => e.key === 'Enter' && getCityCoordinates());