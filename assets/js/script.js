//Initialize Materalize Components
M.AutoInit();

//Start my Script
dayjs.extend(window.dayjs_plugin_localizedFormat)


//Open API variables
const apiKey = '&appid=d10c1d7640a2ce7fdd5367e25b6d3962'
const baseUrl = 'https://api.openweathermap.org/data/2.5/forecast?q='
var extraParams = '&units=imperial'
    //oneCall variables
const oneCallBaseUrl = 'https://api.openweathermap.org/data/2.5/onecall?'
var latitudeResp
var longitudeResp
var excludeOptions = '&exclude=minutely,hourly'
    //Sync iterations globally
var labelIndex = 1
    //used in mulitple functions
var userInput
    //Gets values out from requestApi()
var respName
var respData

//Store the recent city in localStorage
function storeRecent() {
    $('#fiveDayContainer').children().remove('div');
    userInput = $('#userSearch').val();
    if (labelIndex < 6) {
        localStorage.setItem('Recent Search ' + labelIndex, userInput);
        console.log(userInput)

    } else {
        labelIndex = 1;
        localStorage.setItem('Recent Search ' + labelIndex, userInput);
        console.log(userInput)
    }

    updateRecent();

}

//UDPDATE RECENT SEARCH LIST
function updateRecent() {
    $('#recentcityDiv' + labelIndex).remove();
    var recentCity = localStorage.getItem('Recent Search ' + labelIndex);
    var recCityDivEl = $('<div class="card" id="recentcityDiv' + labelIndex + '">"');
    var recCityH4El = $('<h4>' + recentCity + '</h4></div>')
    $('#noRecent').remove();
    $('#recentcityDiv' + labelIndex).remove();
    console.log('#recentcityDiv' + labelIndex);
    $('aside').children('.prvCities').prepend(recCityDivEl);
    $(recCityDivEl).append(recCityH4El);
    console.log(labelIndex)
    labelIndex++;
}

//AJAX REQUEST
function requestAPI() {
    $.ajax({
        url: baseUrl + userInput + extraParams + apiKey,
        method: 'GET',
    }).then(function(response) {
        respData = response.list;
        respName = response.city.name;
        latitudeResp = 'lat=' + response.city.coord.lat;
        longitudeResp = '&lon=' + response.city.coord.lon;
        console.log(respData);
        var h4El = $('.curFocusH4');
        var curFocusStyles = {
            backgroundImage: "url(https://loremflickr.com/600/600/" + respName + ";",
            boxShadow: "1px 4px 11px 4px rgba(0, 0, 0, 0.34);",
        }

        $(h4El).text(respName);
        $('#currentFocus').css(curFocusStyles);
        // genForecast();

    }).then(function() {
        $.ajax({
            url: oneCallBaseUrl + latitudeResp + longitudeResp + extraParams + excludeOptions + apiKey,
            method: 'GET',
        }).then(function(oneCallResponse) {
            console.log(oneCallBaseUrl + latitudeResp + longitudeResp + extraParams + excludeOptions + apiKey)
            console.log('One Call ', oneCallResponse);
            var dailyInfo = oneCallResponse.daily;





            //   for (var i = labelIndex-1; i<labelIndex-1;i++) {

            //     var forecastCard = $('<div class="forecastCard' + labelIndex + '">')
            //     var h4El = $('<h4>'+dailyInfo[i]. + '</h4>')
            //     $('.forecastCard' + labelIndex).remove();
            //     $('#fiveDayContainer').append(forecastCard)
            //     forecastCard.append(h4El)

            console.log(oneCallResponse.daily[0].temp.min);

            for (var i = 1; i < 6; i++) {
                var l = (i - 1) * 8
                console.log('i=', i)
                console.log('l=', l)
                var localDateFormat = dayjs(respData[l].dt_txt).format('LLLL')
                var weatherDescriptionDetail = dailyInfo[i].weather[0].description
                var weatherDescription = dailyInfo[i].weather[0].main
                var highTemp = dailyInfo[i].temp.max
                var lowTemp = dailyInfo[i].temp.min
                var humidity = dailyInfo[i].humidity
                var uvIndex = dailyInfo[i].uvi

                var forecastCard = $('<div class="forecastCard' + i + '">')
                var h4El = $('<h4>' + localDateFormat + '</h4>')
                var h5weatherDescriptEl = $('<h5>' + weatherDescription + '</h5>')
                var detailDivEl = $('<div class="detailDiv">')
                var pLowEl = $('<p> <span> Low:</span> ' + lowTemp + '&#176;</p>')
                var pHighEl = $('<p> <span>High:</span> ' + highTemp + '&#176;</p>')
                var pHumidityEl = $('<p> <span>Humidity:</span> ' + humidity + '</p>')
                var pDescriptionEl = $('<p class="fiveDayDescription">' + weatherDescriptionDetail + '</p>')
                var pUviEl = $('<p><span> UV Index:</span> ' + uvIndex + '</p>')
                $('#fiveDayContainer').append(forecastCard)
                forecastCard.append(h4El);
                forecastCard.append(h5weatherDescriptEl);
                forecastCard.append(pDescriptionEl);
                forecastCard.append(detailDivEl);
                detailDivEl.append(pHighEl);
                detailDivEl.append(pLowEl);
                detailDivEl.append(pHumidityEl);
                detailDivEl.append(pUviEl);

            }
        })
    })
}




$('#searchBtn').on('click', storeRecent);
$('#searchBtn').on('click', requestAPI);
// $('#searchBtn').on('click', displayForecast);