const express = require('express');

const https = require('https');

const app = express();
const letters = [' F', ' C'];
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

app.post('/' , (req, res) => {
    var city = req.body.city;
    var units = req.body.units;
    // get api key from openweather.com
    const APIkey = '';
    const url = 'https://api.openweathermap.org/data/2.5/weather?q=%20'+ city +'&units='+ units +'&appid='+ APIkey;
    https.get(url, (response) => {
        console.log(response.statusCode);

        response.on("data", (data) => {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const feels = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = ' http://openweathermap.org/img/wn/'+ icon + '@2x.png';
            // use multiple res.writes instead of putting everyting in send
            switch (units){
                case 'imperial':
                    res.write('<h1>the temperature in ' + city + ' is ' + temp + letters[0] + '<h1>'); 
                    break;
                case 'metric':
                    res.write('<h1>the temperature in ' + city + ' is ' + temp + letters[1] + '<h1>'); 
                    break;
                default: res.write('<h1>the temperature in ' + city + ' is ' + temp + ' Kelvin. <h1>'); 
            }
            res.write('<h1>The description is ' + feels + '<h1>');
            res.write("<img src =" + imageURL +">");
            res.send();
        })
    })
})

app.listen(3000, () => {
    console.log('listening on port 3000');
})