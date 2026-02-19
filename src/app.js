api = "dd37b7000f35f392a6129b57fc14107d";
forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";
apiUrl = "https://api.openweathermap.org/data/2.5/weather";

const input = document.querySelector("input");
const searchbtn = document.getElementById("searchbtn");
const cityspan = document.getElementById("city");
const info = document.getElementById("info");
const temp = document.getElementById("temp");
const minTemp = document.getElementById("min-temp");
const maxTemp = document.getElementById("max-temp");
const pressureWeather = document.getElementById("pressure-weather");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");

const getWeather =async (city)=>{
    const result = await fetch(`${apiUrl}?q=${city}&units=metric&lang=fa&appid=${api}`);
    const data = await result.json();
    
    cityspan.textContent = `${data.name}`;
    info.textContent = `${data.weather[0].description}`;
    temp.textContent = `${data.main.temp} °C 🌡`;
    minTemp.textContent = `کمترین دما :${data.main.temp_min}`;
    maxTemp.textContent = `بیشترین دما :${data.main.temp_max}`;
    pressureWeather.textContent = `فشار هوا :${data.main.pressure}`;
    humidity.textContent = ` رطوبت :${data.main.humidity}`;
    windSpeed.textContent = `سرعت باد :${data.wind.speed}`;

    const weatherMain = data.weather[0].main.toLowerCase();
    weatherIcon(weatherMain);
    getForecast(city);

}

const getForecast = async (city) => {
    const res = await fetch(`${forecastUrl}?q=${city}&units=metric&lang=fa&appid=${api}`);
    const data = await res.json();

    const container = document.getElementById("forecast-container");
    container.innerHTML = "";

    if (!data.list) return;

    const dailyMap = {};

    data.list.forEach(item => {
        const date = item.dt_txt.split(" ")[0]; 

        if (!dailyMap[date]) {
            dailyMap[date] = item;
        }
    });

    const dailyArray = Object.values(dailyMap);

    dailyArray.forEach(day => {
        const dateObj = new Date(day.dt_txt);
        const weekday = dateObj.toLocaleDateString("fa-IR", { weekday: "short" });

        const weatherMain = day.weather[0].main.toLowerCase();
        const iconClass = getIconClass(weatherMain);

        const card = document.createElement("div");
        card.className = "forecast-card";

        card.innerHTML = `
            <div class="forecast-day">${weekday}</div>
            <i class="${iconClass}"></i>
            <div class="forecast-temp">${Math.round(day.main.temp)}°C</div>
        `;

        container.appendChild(card);
    });
};



const weatherIcon = (weather)=>{
  const iconDiv = document.getElementById("icon");
  iconDiv.innerHTML = "";
  let iconClass = "";

  switch(weather){
    case "clear":
      iconClass = "fa-solid fa-sun";
      break;
    case "clouds":
      iconClass = "fa-solid fa-cloud";
      break;
    case "rain":
      iconClass = "fa-solid fa-cloud-showers-heavy";
      break;
    case "snow":
      iconClass = "fa-solid fa-snowflake";
      break;
    case "thunderstorm":
      iconClass = "fa-solid fa-bolt";
      break;
    case "drizzle":
      iconClass = "fa-solid fa-cloud-rain"; 
      break;
    case "mist":
    case "fog":
    iconClass = "fa-solid fa-smog";
    break;
    
  }

  const i = document.createElement("i");
  i.className = iconClass + " fa-4x";
  iconDiv.appendChild(i);

}

weatherIcon("clear");

const getIconClass = (weather) => {
  switch(weather){
    case "clear":
      return "fa-solid fa-sun";
    case "clouds":
      return "fa-solid fa-cloud";
    case "rain":
      return "fa-solid fa-cloud-showers-heavy";
    case "snow":
      return "fa-solid fa-snowflake";
    case "thunderstorm":
      return "fa-solid fa-bolt";
    case "drizzle":
      return "fa-solid fa-cloud-rain";
    case "mist":
    case "fog":
      return "fa-solid fa-smog";
    default:
      return "fa-solid fa-cloud";
  }
};


searchbtn.addEventListener("click", () => {
  const cityName = input.value.trim();
  if (cityName) {
    localStorage.setItem("lastCity", cityName);
    getWeather(cityName);
  } else {
    alert("لطفا نام شهر را وارد کنید!");
  }
});

input.addEventListener("keydown" , (event)=>{
  if(event.key === "Enter"){
    searchbtn.click();
  }
})

getWeather("shiraz");

function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  document.getElementById("clock").textContent = `${hours}:${minutes}:${seconds}`;
}

setInterval(updateClock, 1000);

updateClock();

window.addEventListener("DOMContentLoaded", () => {
  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) {
    input.value = lastCity;
    getWeather(lastCity); 
  } else {
    getWeather("shiraz"); 
  }
});

const reload = document.getElementById("reload");

reload.addEventListener("click",()=>{
  location.reload();
});

const darkBtn = document.getElementById("dark-toggle");
const themeIcon = darkBtn.querySelector("i");

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.body.classList.add('dark-mode');
  themeIcon.className = "fa-solid fa-moon";
} else {
  themeIcon.className = "fa-solid fa-adjust"; 
}

darkBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    themeIcon.className = "fa-solid fa-moon";
  } else {
    themeIcon.className = "fa-solid fa-adjust";
  }
});

const infoBtn = document.getElementById("info-btn");
const infoModal = document.getElementById("info-modal");

infoBtn.addEventListener("click", (e) => {
  e.stopPropagation(); 
  infoModal.classList.toggle("show");
});

document.addEventListener("click", (e) => {
  if (!infoModal.contains(e.target) && !infoBtn.contains(e.target)) {
    infoModal.classList.remove("show");
  }
});



