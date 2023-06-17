const apikey="dfa47bd33e07e9f2b6419d08052782d7";
// 9c7e41d05c5d72576f5bdcd5b8275982
const loactionBtn = document.getElementById("locationb"),
container = document.querySelector(".spaced-content");
let api;
window.addEventListener("load",()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position)=>{
            let lon= position.coords.longitude;
            let lat= position.coords.latitude;
            const url= `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&` + `lon=${lon}&appid=${apikey}`;
            

            fetch(url).then((res)=>{
                return res.json();
            }).then((data)=>{
                console.log(data);
                console.log(new Date().getTime())
                var dat= new Date(data.dt)
                console.log(dat.toLocaleString(undefined,'Asia/Kolkata'))
                console.log(new Date().getMinutes())
                weatherReport(data);
               
              
            })
        })
    }
})

// fetching data for current location......
loactionBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
      alert("Your browser does not support geoloaction api");
    }
  });
function onSuccess(position) {
console.log(position);
const { latitude, longitude } = position.coords;
api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&` + `lon=${longitude}&appid=${apikey}`;
fetchData();
}

// error if occur
function onError(error) {
//  console.log(error)
textError.innerText = error.message;
textError.classList.add("error");
}
// function to fetch api
function fetchData() {
    // textError.innerText = "Getting weather info,Please wait...";
    // textError.classList.add("wait");
    // api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apikey}`;
    fetch(api)
      .then((response) => response.json())
      .then((result) => weatherReport(result));
  }

function searchByCity(){
    var place= document.getElementById('input').value;
    if(place==""){
        alert("enter city name!!!");
    }else{
    var urlsearch= `http://api.openweathermap.org/data/2.5/weather?q=${place}&` + `appid=${apikey}`;

    fetch(urlsearch).then((res)=>{
        return res.json();
    }).then((data)=>{
        console.log(data);
        weatherReport(data);
    })
    document.getElementById('input').value='';
}
}

function weatherReport(data){

    var urlcast= `http://api.openweathermap.org/data/2.5/forecast?q=${data.name}&` + `appid=${apikey}`;
   
    fetch(urlcast).then((res)=>{
        return res.json();
    }).then((forecast)=>{
        console.log(forecast.city);
        hourForecast(forecast);
        dayForecast(forecast)

        console.log(data);
        document.getElementById('city').innerText= data.name + ', '+data.sys.country;
        console.log(data.name,data.sys.country);
    
        console.log(Math.floor(data.main.temp-273));
        document.getElementById('temperature').innerText= Math.floor(data.main.temp-273)+ ' °C';
    
        document.getElementById('clouds').innerText= data.weather[0].description;
        console.log(data.weather[0].description)
        
        let icon1= data.weather[0].icon;
        let iconurl= `http://openweathermap.org/img/wn/${icon1}@2x.png`;
        document.getElementById('img').src=iconurl
    })
    const { humidity, pressure, temp_max, temp_min } = data.main, visibility = data.visibility, speed = data.wind.speed;
container.querySelector("#min-temp").innerText = Math.floor((temp_min - 273))+ ' °C';
document.getElementById('max-temp').innerHTML=Math.floor((temp_max - 273))+ ' °C';
document.getElementById('humidity').innerHTML=humidity+' %';
document.getElementById('wind-speed').innerHTML=speed+' Km/H';
document.getElementById('pressure').innerHTML=Math.floor((pressure / 10))+' Mb';
document.getElementById('visibility').innerHTML=Math.floor((visibility / 1000))+' Km';
// container.querySelector("#max-temp"),(innerText = Math.floor((temp_max - 273))+ ' °C');
// container.querySelector("#humidity"), (innerText = humidity);
// container.querySelector("#wind-speed"), (innerText = speed);
// container.querySelector("#pressure"), (innerText = pressure);
// container.querySelector("#visibility").innerText = visibility;
    
}

function hourForecast(forecast){
    document.querySelector('.templist').innerHTML=''
    
    
    for (let i = 0; i < 5; i++) {

        var date= new Date(forecast.list[i].dt*1000)
        console.log((date.toLocaleTimeString(undefined,'Asia/Kolkata')).replace(':00',''))

        let hourR=document.createElement('div');
        hourR.setAttribute('class','next');

        let div= document.createElement('div');
        let time= document.createElement('p');
        time.setAttribute('class','time')
        time.innerText= (date.toLocaleTimeString(undefined,'Asia/Kolkata')).replace(':00','');

        let temp= document.createElement('p');
        temp.innerText= Math.floor((forecast.list[i].main.temp_max - 273))+ ' °C' + ' / ' + Math.floor((forecast.list[i].main.temp_min - 273))+ ' °C';

        div.appendChild(time)
        div.appendChild(temp)

        let desc= document.createElement('p');
        desc.setAttribute('class','desc')
        desc.innerText= forecast.list[i].weather[0].description;

        hourR.appendChild(div);
        hourR.appendChild(desc)
        document.querySelector('.templist').appendChild(hourR);
}

}

function dayForecast(forecast){
    document.querySelector('.weekF').innerHTML=''
    for (let i = 8; i < forecast.list.length; i+=7) {
        // for (let i = 0; i < 6; i++) {
        console.log(forecast.list[i]);
        let div= document.createElement('div');
        div.setAttribute('class','dayF');
        
        let day= document.createElement('p');
        day.setAttribute('class','date')
        day.innerText= new Date(forecast.list[i].dt*1000).toDateString(undefined,'Asia/Kolkata');
        div.appendChild(day);

        let temp= document.createElement('p');
        temp.setAttribute('class','tempf');
        temp.innerText= Math.floor((forecast.list[i].main.temp_max - 273))+ ' °C' + ' / ' + Math.floor((forecast.list[i].main.temp_min - 273))+ ' °C';
        div.appendChild(temp)

        let icon1= forecast.list[i].weather[0].icon;
        let iconurl= `http://openweathermap.org/img/wn/${icon1}@2x.png`;
        let img1= document.createElement('img');
        console.log(iconurl);
        img1.src=iconurl;
        img1.alt="aaaaaaaa"
        img1.setAttribute('id','imgf');
        div.appendChild(img1);

        let description= document.createElement('p');
        description.setAttribute('class','desc')
        description.innerText= forecast.list[i].weather[0].description;
        div.appendChild(description);
        
       
        document.querySelector('.weekF').appendChild(div)
    }
} 
