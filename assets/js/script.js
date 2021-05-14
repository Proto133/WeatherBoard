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
    $('#leftCurDay').children().remove();
    $('#rightCurDay').children().remove();
    $('#curFocusHeader').children().remove();
    userInput = $('#userSearch').val();

    if (labelIndex <= 5) {
        localStorage.setItem('Recent Search ' + labelIndex, userInput);
    } else {
        labelIndex = 1;
        localStorage.setItem('Recent Search ' + labelIndex, userInput);
        console.log(userInput)
    }
    updateRecent();
}

var recCityDivEl
var recCity
var recCityH4El
    //UDPDATE RECENT SEARCH LIST
function updateRecent() {
    $('#recentcityDiv' + labelIndex).remove();
    recentCity = localStorage.getItem('Recent Search ' + labelIndex);
    recCityDivEl = $('<div class="card" id="recentcityDiv' + labelIndex + '">');
    recCityH4El = $('<h4>' + recentCity + '</h4></div>')
    recCityH4El.attr('data-name', recentCity)
    $('#noRecent').remove();
    $('#recentcityDiv' + labelIndex).remove();
    console.log('#recentcityDiv' + labelIndex);
    $('aside').children('.prvCities').prepend(recCityDivEl);
    $(recCityDivEl).append(recCityH4El);
    console.log(labelIndex)
    labelIndex++;
    requestAPI();
}

function clearInput() {
    document.getElementById('userSearch').value = ''
}

//AJAX REQUEST
function requestAPI() {
    $('#fiveDayContainer').children().remove('div');
    $('#leftCurDay').children().remove();
    $('#rightCurDay').children().remove();
    $('#curFocusHeader').children().remove();
    $.ajax({
        url: baseUrl + userInput + extraParams + apiKey,
        method: 'GET',
    }).then(function(response) {
        respData = response.list;
        respName = response.city.name;
        latitudeResp = 'lat=' + response.city.coord.lat;
        longitudeResp = '&lon=' + response.city.coord.lon;
        console.log(respData);
        var h3El = $('<h3 id=curFocusH3>' + respName + '</h3>');
        $('#curFocusHeader').append(h3El);
        clearInput();

    }).then(function() {
        $.ajax({
            url: oneCallBaseUrl + latitudeResp + longitudeResp + extraParams + excludeOptions + apiKey,
            method: 'GET',
        }).then(function(oneCallResponse) {
            console.log(oneCallBaseUrl + latitudeResp + longitudeResp + extraParams + excludeOptions + apiKey)
            console.log('One Call ', oneCallResponse);
            var dailyInfo = oneCallResponse.daily;
            var curInfo = oneCallResponse.current;
            console.log(oneCallResponse.daily[0].temp.min);
            //Parse through 2 indices concurrently
            for (var i = 1; i < 6; i++) {
                if (i > 1) {
                    var l = (i - 1) * 8
                } else { l = 1 }
                //Create Variables locating specific response data for Forecast card
                var localDayFormat = dayjs(respData[l].dt_txt).format('dddd')
                var localDateFormat = dayjs(respData[l].dt_txt).format('MMM / D / YYYY')
                var weatherDescriptionDetail = dailyInfo[i].weather[0].description
                var weatherDescription = dailyInfo[i].weather[0].main
                var highTemp = dailyInfo[i].temp.max
                var lowTemp = dailyInfo[i].temp.min
                var humidity = dailyInfo[i].humidity
                var uvIndex = dailyInfo[i].uvi




                //Add HTML Elements for 5 Day Forecast
                var forecastCard = $('<div class="forecastCard' + i + '">')
                var h4DayforecastEL = $('<h4 class="localDayFormat">' + localDayFormat + '</h4>')
                var h4ForecastEl = $('<h4 class="localDateFormat">' + localDateFormat + '</h4>')
                var h5weatherDescriptEl = $('<h5>' + weatherDescription + '</h5>')
                var detailDivEl = $('<div class="detailDiv">')
                var pLowEl = $('<p> <span> Low:</span> ' + lowTemp + '&#176;</p>')
                var pHighEl = $('<p> <span>High:</span> ' + highTemp + '&#176;</p>')
                var pHumidityEl = $('<p> <span>Humidity:</span> ' + humidity + '&#x25;</p>')
                var pDescriptionEl = $('<p class="fiveDayDescription">' + weatherDescriptionDetail + '</p>')
                var pUviEl = $('<p><span> UV Index:</span> ' + uvIndex + '</p>')
                $('#fiveDayContainer').append(forecastCard)
                forecastCard.append(h4DayforecastEL);
                forecastCard.append(h4ForecastEl);
                forecastCard.append(h5weatherDescriptEl);
                forecastCard.append(pDescriptionEl);
                forecastCard.append(detailDivEl);
                detailDivEl.append(pHighEl);
                detailDivEl.append(pLowEl);
                detailDivEl.append(pHumidityEl);
                detailDivEl.append(pUviEl);

            }

            //Create Variables locating specific response data for Current Focus
            var currentDay = dailyInfo[0]
            var curDay = dayjs().format('dddd')
            var curDate = dayjs().format('MMM DD YYYY hh:mm')
            console.log(curDate)
            var curDayDesc = curInfo.weather[0].main
            var curDayDetail = curInfo.weather[0].description
            var curDayTemp = curInfo.temp
            var curDayFeel = curInfo.feels_like
            var curDayHigh = currentDay.temp.max
            var curDayLow = currentDay.temp.min
            var curDayUV = curInfo.uvi
            var curDayWindSpeed = curInfo.wind_speed
            var curDayHumidity = curInfo.humidity

            //Add HTML Elements for Current Day
            var curDayEl = $('<h5>' + curDay + '</h5>')
            var curDateEl = $('<p id="curDate">' + curDate + '</p>')
            var curDayDescEl = $('<h5 id="curFocusDecription">' + curDayDesc + '</h5>')
            var curDayDetailEl = $('<h5 id="curFocusDetail">' + curDayDetail + '</h5>')
            var curDayTempEl = $('<p id="curTemp" >' + Math.round(curDayTemp) + '&#176;</p>')
            var curDayFeelEl = $('<p id="curFeel"><span>Feels Like:</span> ' + Math.round(curDayFeel) + '&#176;</p>')
            var curDayHighEl = $('<p id="curDayHi" class="curDayHiLo"><span>High:</span> ' + curDayHigh + '&#176;</p>')
            var curDayLowEl = $('<p id="curDayLo" class="curDayHiLo"><span>Low:</span> ' + curDayLow + '&#176</p>')
            var curDayUVEl = $('<div id="curDayUV"><p ><span>UV Index:</span> ' + curDayUV + '</p></div>')
            var curDayHumidityEl = $('<p id="curDayHumidity" class="curDayHiLo"><span>Humidity:</span> ' + curDayHumidity + '&#x25;</p>')
            var curDayWindEl = $('<p id="curDayWind" class="curDayHiLo"><span>Wind Speed:</span> ' + curDayWindSpeed + 'MPH</p>')
            var trimCurDetail = curDayDetail.replace(/\s+/g, '');
            var curFocusStyles = {
                backgroundImage: "url(https://loremflickr.com/600/600/" + trimCurDetail + ";",
                boxShadow: "1px 4px 11px 4px rgba(0, 0, 0, 0.34);",
            }

            //Appending Header
            $('#curFocusHeader').append(curDayDescEl);
            $('#curFocusHeader').append(curDayDetailEl);
            //Appending Left Panel
            $('#leftCurDay').append(curDayEl);
            $('#leftCurDay').append(curDateEl);
            $('#leftCurDay').append(curDayTempEl);
            $('#leftCurDay').append(curDayFeelEl);
            //Appending Right Panel
            $('#rightCurDay').append(curDayHighEl);
            $('#rightCurDay').append(curDayLowEl);
            $('#rightCurDay').append(curDayHumidityEl);
            $('#rightCurDay').append(curDayWindEl);
            $('#rightCurDay').append(curDayUVEl);

            //Appending container
            $('#currentFocus').css(curFocusStyles);

            $(function() {
                if (curDayUV <= 2) {
                    $('#curDayUV').removeClass('uvDanger uvHigh uvCaution');
                    $('#curDayUV').addClass('uvClear');
                } else if (curDayUV >= 3 && curDayUV <= 5) {
                    $('#curDayUV').removeClass('uvDanger uvHigh uvClear');
                    $('#curDayUV').addClass('uvCaution');
                } else if (curDayUV >= 6 && curDayUV <= 7) {
                    $('#curDayUV').removeClass('uvDanger uvCaution uvClear');
                    $('#curDayUV').addClass('uvHigh');
                } else {
                    $('#curDayUV').removeClass('uvHigh uvClear uvCaution');
                    $('#curDayUV').addClass('uvDanger')
                }

            })
        })

    })

}

$('.prvCities').on('click', '.card', function(event) {
    userInput = $(event.target).attr('data-name')
    console.log(event.target)
    requestAPI();
})

$('.btn').on('click', storeRecent);
// $('#searchBtn').on('click', displayForecast);