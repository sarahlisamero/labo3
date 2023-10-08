class App {
  constructor(){
    this.getLocation();
    this.lat;
    this.lng;
  }
  getLocation(){
    navigator.geolocation.getCurrentPosition(
      this.gotLocation.bind(this),
      this.errorLocation.bind(this)
    );
  }
  gotLocation(result){
    this.lat = result.coords.latitude;
    this.lng = result.coords.longitude;
    this.getWeather();
  }
  getWeather(){
    let url = `https://api.open-meteo.com/v1/forecast?latitude=${this.lat}&longitude=${this.lng}&hourly=temperature_2m&current_weather=true&timezone=auto`;
    fetch(url).then(response =>{
      return response.json();
    }).then(data => {
      document.querySelector("#app").innerHTML = data.current_weather.temperature;
    })
    .catch(err => {
      console.log(err);
    });
  }
  errorLocation(err){
    console.log(err);
  }
}
let app = new App();