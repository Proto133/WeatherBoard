//Initialize Materalize Components
M.AutoInit();

//Start my Script
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
        console.log(response);
        var h4El = $('.curFocusH4');
        var curFocusStyles = {
            backgroundImage: "url(https://loremflickr.com/600/600/" + respName + ";",
            boxShadow: "1px 4px 11px 4px rgba(0, 0, 0, 0.34);",
        }

        $(h4El).text(respName);
        $('#currentFocus').css(curFocusStyles);
        genForecast();

    }).then(function() {
        $.ajax({
            url: oneCallBaseUrl + latitudeResp + longitudeResp + extraParams + excludeOptions + apiKey,
            method: 'GET',
        }).then(function(oneCallResponse) {
            console.log('One Call ', oneCallResponse);
            var dailyInfo = oneCallResponse.daily;
            var lowtemp = dailyInfo[0].temp.min

        })

        //   for (var i = labelIndex-1; i<labelIndex-1;i++) {

        //     var forecastCard = $('<div class="forecastCard' + labelIndex + '">')
        //     var h4El = $('<h4>'+dailyInfo[i]. + '</h4>')
        //     $('.forecastCard' + labelIndex).remove();
        //     $('#fiveDayContainer').append(forecastCard)
        //     forecastCard.append(h4El)
    })
}

function genForecast() {
    for (var i = 1, l = 0; i < 6, l < ; i++) {
        console.log('i=', i)
        console.log(i - 1)
        var forecastCard = $('<div class="forecastCard' + i + '">')
        var h4El = $('<h4>' + respData[i - 1].dt_txt + '</h4>')

        $('#fiveDayContainer').append(forecastCard)
        forecastCard.append(h4El);
    }
}




$('#searchBtn').on('click', storeRecent);
$('#searchBtn').on('click', requestAPI);
// $('#searchBtn').on('click', displayForecast);