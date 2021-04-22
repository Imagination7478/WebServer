const fetch = require("node-fetch")
const axios = require('axios').default;
const apikey = "bed950b3229a2b9bc8677bb8c28d5508"


  class ApiReq{
    constructor(){
      this.key = '&appid=bed950b3229a2b9bc8677bb8c28d5508&lang=ru&units=metric';
      this.url = "https://api.openweathermap.org/data/2.5/";
    }

    convertWind (wind){
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

    async fillJson(json){
      //const { current, location } = json;

      return {
        city: json.name,
        coords: {
          lat: json.lat,
          lon: json.lon,
        },
        temp: `${Math.round(json.temp_c)}°C`,
        wind: `${json.wind_mph} m/s, ${this.convertWind(json.wind_dir)}`,
        cloud: `${json.cloud} %`,
        press: `${json.pressure_mb} hpa`,
        humidity: `${json.humidity} %`,
        icon: json.icon,
      }
    }

    async getCity(cityORcoord){

      const coord = cityORcoord.split(',')
      const response = await fetch( this.url + 'onecall?lat='  + coord[0] + '&lon=' + coord[1] + this.key)
      .then(function(resp){
        return resp.json()
      })
      
      return this.fillJson(response)
      
      
    }
  async getAnyCity(cities) {
    return await Promise.all(cities.map(city => {
      return this.getCity(city);
    }))
  }

}
  module.exports = ApiReq