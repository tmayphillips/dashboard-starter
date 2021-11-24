class Weather{
    api_key = 'W12NSR1B1ERXGe1ujranrqgRskG4CrUN'
    // api_key = 'BcvC9BvJJeurviMh9B1WB9ksxqDeDSeN'
    query = '77008'
    
    constructor() {}

    render(){
        const weather = document.querySelector('.weather');
        const city_url = `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${this.api_key}&q=`
        const current_url = 'http://dataservice.accuweather.com/currentconditions/v1/'
        const forecast_url = 'http://dataservice.accuweather.com/forecasts/v1/daily/5day/'
        const headers = { 'Content-Type': 'application/json' }
        
        let locationKey, locationName, current, forecast, scale = ''
        let forecastDays = []
        let forecastHighs = []
        let forecastLows = []
        let forecastChart

        const getLocationInfo = async () => {
            let result = await axios.get(city_url+this.query, {
                headers: headers
            })
            locationKey = result.data[0].Key
            locationName = result.data[0].LocalizedName
            
            getForecastWeather(locationKey)
            getCurrentWeather(locationKey)
        }

        const getForecastWeather = async (locationKey) => {
            let result = await axios.get(`${forecast_url}${locationKey}?apikey=${this.api_key}`, {
                headers: headers
            })
            forecast = result.data.DailyForecasts

            forecastDays = []
            forecastHighs = []
            forecastLows = []

            forecast.forEach(element => {
                forecastHighs.push(element.Temperature.Maximum.Value)
                forecastLows.push(element.Temperature.Minimum.Value)
                let date = new Date(element.Date)
                forecastDays.push(date.toString().substr(0,3)) 
            })
            
            if (forecastChart) {
                removeData(forecastChart)
                forecastChart.destroy()
            }

            let ctx = document.getElementById("forecast").getContext('2d');

            forecastChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: forecastDays,
                    datasets: [{
                        label: 'High', // Name the series
                        data: forecastHighs, // Specify the data values array
                        fill: false,
                        borderColor: '#FF5349', // Add custom color border (Line)
                        backgroundColor: '#FF5349', // Add custom color background (Points and Fill)
                        borderWidth: 1 // Specify bar border width
                    },
                    {
                        label: 'Low', // Name the series
                        data: forecastLows, // Specify the data values array
                        fill: false,
                        borderColor: '#2196f3', // Add custom color border (Line)
                        backgroundColor: '#2196f3', // Add custom color background (Points and Fill)
                        borderWidth: 1 // Specify bar border width
                    }]},
                options: {
                responsive: true, // Instruct chart js to respond nicely.
                maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height 
                }
            });
        }
        
        function removeData(chart) {
            chart.data.labels.pop();
            chart.data.datasets.forEach((dataset) => {
                dataset.data.pop();
            });
            chart.update();
        }

        const getCurrentWeather = async (locationKey) => {
            scale = 'F'
            let currentWeather = document.getElementById('current-weather')
            let result = await axios.get(`${current_url}${locationKey}?apikey=${this.api_key}`, {
                headers: headers
            })
            current = result.data

            let icon = current[0].WeatherIcon
            icon = icon.toString()
            if (icon.length < 2) {
                icon = '0' + icon
            } 
            currentWeather.innerHTML = `
                <img src = './weather-icons/${icon}-s.png' />
                <p>${current[0].WeatherText}, ${current[0].Temperature.Imperial.Value}&#176 ${scale}</p>
                <div>
                    <button class='btn' id='locationBtn' >Change location</button>
                <div>
                <div id="weather-modal" class="modal">
                    <div class="modal-content">
                        <span class="close">&times;</span>
                        <form>
                            <input type='text' id='zipcode' />
                            <button type='submit' class='btn' id='locationSubmitBtn'>Submit</button>
                        </form>
                    </div>
                </div>
            `

            const modal = document.getElementById('weather-modal');
            const locationBtn = document.getElementById('locationBtn');
            const locationSubmitBtn = document.getElementById('locationSubmitBtn')
            const span = document.getElementsByClassName('close')[0];

            // close on X
            span.onclick = function() {
                modal.style.display = "none";
            }

            // close on outside window click
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }

            locationBtn.addEventListener('click', event => {
                modal.style.display = 'block'
            })

            locationSubmitBtn.addEventListener('click', event => {
                event.preventDefault()
                let input = document.getElementById('zipcode').value
                this.query = input
                
                getLocationInfo()
            })
        }

        getLocationInfo()
    }
}

export default Weather;