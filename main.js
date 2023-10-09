class App {
  constructor(){
    this.getLocation();
    /*this.lat;
    this.lng;*/
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
      const currentTemperature = data.current_weather.temperature;
      let message = "";
        switch (true) {
          case currentTemperature < 10:
            message = `Right now it is ${currentTemperature} degrees. That's cold brrr!`;
            break;
          case currentTemperature >= 10 && currentTemperature <= 20:
            message = `Right now it is ${currentTemperature} degrees. That's a bit chilly!`;
            break;
          case currentTemperature >= 20:
            message = `Right now it is ${currentTemperature} degrees. That's warm, puff puff!`;
            break;
          default:
            message = `Right now it is ${currentTemperature} degrees. That's an unusual temperature!`;
        }
      document.querySelector("#app").innerHTML = message;
      this.recommendCocktail(currentTemperature);
    })
    .catch(err => {
      console.log(err);
    });
  }
  recommendCocktail(currentTemperature) {
    let cocktailCategory;

    switch (true) {
      case currentTemperature < 10:
        cocktailCategory = "Cocoa";
        break;
      case currentTemperature >= 10 && currentTemperature <= 20:
        cocktailCategory = "Ordinary_Drink";
        break;
      case currentTemperature >= 20:
        cocktailCategory = "Cocktail";
        break;
      default:
        cocktailCategory = "Unknown";
    }
    
    this.fetchRandomCocktail(cocktailCategory);
  }
  fetchRandomCocktail(cocktailCategory) {
    let cocktailUrl = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${cocktailCategory}`;

    fetch(cocktailUrl)
      .then(response =>{ 
        return response.json()
      })
      .then(cocktailData => {
        if (cocktailData.drinks && cocktailData.drinks.length > 0) {
          const randomIndex = Math.floor(Math.random() * cocktailData.drinks.length);
          const cocktail = cocktailData.drinks[randomIndex];
          const cocktailName = cocktail.strDrink;

          document.querySelector("#drink").innerHTML = `Recommended Cocktail for temperature: ${cocktailName}`;

          const cocktailImage = cocktail.strDrinkThumb;
          const image = new Image();
          image.setAttribute("src", cocktailImage);
          image.setAttribute("alt", cocktailName);
          image.style.maxWidth = "300px"; 
          document.querySelector("#drinkImage").appendChild(image);

        } else {
          document.querySelector("#drink").innerHTML =`No cocktails found for this temperature.`;
        }
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