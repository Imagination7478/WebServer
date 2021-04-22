const fetch = require("node-fetch")
const axios = require('axios').default;
const apikey = "bed950b3229a2b9bc8677bb8c28d5508"

function convertWind (wind){
    const dirs = {N: 'С', W: 'З', E: 'В', S: 'Ю'};
    let result = '';
  
    if (wind === 0) {result += dirs.N;}
    if ((wind > 0) && (wind <= 45) ) {result += dirs.N + '/' + dirs.E;}
    if ((wind > 45) && (wind <= 90) ) {result += dirs.E;}
    if ((wind > 90) && (wind <= 135) ) {result += dirs.E + '/' + dirs.S;}
    if ((wind > 135) && (wind <= 180) ) {result +=dirs.S;}
    if ((wind > 180) && (wind <= 225) ) {result += dirs.S + '/' + dirs.W;}
    if ((wind > 225) && (wind <= 270) ) {result +=dirs.W;}
    if ((wind > 270) && (wind <= 315) ) {result += dirs.N + '/' + dirs.W;}
    if ((wind > 315) && (wind <= 360) ) {result +=dirs.N;}
  
    return result;
  }

  class ApiReq{
    constructor(){
      this.key = '&appid=bed950b3229a2b9bc8677bb8c28d5508&lang=ru&units=metric';
      this.urlSample = "https://api.openweathermap.org/data/2.5/weather?";
    }

    async fillJson(json){
        let resJson ={
            coords : {
                lat : json.coord.lat,
                lon : json.coord.lon
              },
              temp : json.main.temp,
              icon : "https://openweathermap.org/img/wn/" + (json.weather[0].icon) + "@2x.png",
              wind : json.wind.speed,
              windDir : convertWind(json.wind.deg),
              pressure : json.main.pressure,
              humidity : json.main.humidity,
              cloud : json.clouds.all + '%'
        }
        return resJson
    }

    async getCity(cityORcoord){
        const options = {
            method: 'GET',
            url: this.pattern,
            params: { q: cityORcoord.replace(' ', '%20') },
            headers: {
              'x-rapidapi-key': this.key,
            },
          };
        const response = await axios.request(options)
        return this.fillJson(response.data)
    }
  }

  module.exports = ApiReq