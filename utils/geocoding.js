const axios=require("axios");

let GeocodeURL='https://nominatim.openstreetmap.org/search?street=';
let format='format=json';

module.exports.GEOCODE=async(location, country)=>{
  let str=location.replace(" ", "-");
  let url=GeocodeURL+str+"&country="+country+"&"+"limit=1"+"&"+format;
  let result=await axios.get(url);
  return await result.data[0];
}