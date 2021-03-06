//Initialize Materalize Components
M.AutoInit();

window.onload = function() {
        $('.modal-close').hide()
        $('#currentFocus').hide();
    }
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

//Validate search parameters
function validate() {
    userInput = $('#userSearch').val();
    userInput.trim()
        //Can't search for nothing
    if (userInput == "") {
        $('#modal1').show();
        $('.modal-close').show();
        return false;
        //No searching for numbers
    } else if (!/^[a-z A-Z]*$/g.test(userInput)) {
        $('#modal1').show();
        $('.modal-close').show();
        return false;
        //Who knows any 2 letter cities . . . I don't
    } else if (userInput.length < 2) {
        $('#modal1').show();
        $('.modal-close').show();
        return false;
        //If user has already searched it, inform them that they're a dunce and highlight where they should have clicked
    } else if (userInput == $('.prvCities').children().children().attr('data-name')) {
        $('#modal2').show();
        $('.prvCities').addClass('highlight');
        $('#modal2-close').show();
        $('#userSearch').val('');
        $('#userSearch').focus();
    } else {
        storeRecent();
    }
}

//Close modal if popped 
$('.modal-close').on('click', function() {
    $('.modal').hide();
    $('.modal-close').hide();
    $('#userSearch').val('');
    $('#userSearch').focus();
})

//Close modal2 if popped
$('#modal2-close').on('click', function() {
    $('.prvCities').removeClass('highlight');
});

//Store the recent city in localStorage
function storeRecent() {
    //Remove all the current focus elements that were created on the last search
    $('#fiveDayContainer').children().remove('div');
    $('#leftCurDay').children().remove();
    $('#rightCurDay').children().remove();
    $('#curFocusHeader').children().remove();
    //Don't let the list of recents grow beyond 5
    if (labelIndex <= 5) {
        localStorage.setItem('Recent Search ' + labelIndex, userInput);
    } else {
        labelIndex = 1;
        localStorage.setItem('Recent Search ' + labelIndex, userInput);
        console.log(userInput)
    }
    updateRecent();
}

//Declare recent city related variables globally to be called later.
var recCityDivEl
var recCity
var recCityH4El

//UDPDATE RECENT SEARCH LIST
function updateRecent() {
    $('#currentFocus').show();
    $('#recentcityDiv' + labelIndex).remove();
    recentCity = localStorage.getItem('Recent Search ' + labelIndex);
    recCityDivEl = $('<div class="card" id="recentcityDiv' + labelIndex + '"></div>');
    recCityH4El = $('<h4>' + recentCity + '</h4>')
    recCityH4El.attr('data-name', recentCity)
    $('#noRecent').remove();
    $('#recentcityDiv' + labelIndex).remove();
    console.log('#recentcityDiv' + labelIndex);
    $('aside').children('.prvCities').prepend(recCityDivEl);
    $(recCityDivEl).append(recCityH4El);
    $(recCityDivEl).addClass('noselect');
    labelIndex++;
    requestAPI();
}

// Reset User Input field
function clearInput() {
    document.getElementById('userSearch').value = ''
}

//AJAX REQUEST
function requestAPI() {
    $('#fiveDayContainer').children().remove('div');
    $('#leftCurDay').children().remove();
    $('#rightCurDay').children().remove();
    $('#curFocusHeader').children().remove();

    console.log(baseUrl + userInput + extraParams + apiKey)
    $.ajax({
            url: baseUrl + userInput + extraParams + apiKey,
            method: 'GET',
            error: function(jqXHR, textStatus, errorThrown) {
                if (jqXHR.status == 404 || errorThrown == 'Not Found') {
                    $('.prvCities').find('div:first').remove();
                    $('#modal1').show();
                    $('.modal-close').show();
                    userInput = '';
                    labelIndex--;
                    return false;
                }
            }
        })
        .then(function(response) {
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
                    var highTemp = Math.round(dailyInfo[i].temp.max)
                    var lowTemp = Math.round(dailyInfo[i].temp.min)
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
                var curDayTemp = Math.round(curInfo.temp)
                var curDayFeel = Math.round(curInfo.feels_like)
                var curDayHigh = Math.round(currentDay.temp.max)
                var curDayLow = Math.round(currentDay.temp.min)
                var curDayUV = curInfo.uvi
                var curDayWindSpeed = curInfo.wind_speed
                var curDayHumidity = curInfo.humidity
                    //Add HTML Elements for Current Day
                var imgIcon = $('<img id="imageIcon"></img>')
                var curDayEl = $('<h5>' + curDay + '</h5>')
                var curDateEl = $('<p id="curDate">' + curDate + '</p>')
                var curDayDescEl = $('<h5 id="curFocusDecription">' + curDayDesc + '</h5>')
                var curDayDetailEl = $('<h5 id="curFocusDetail">' + curDayDetail + '</h5>')
                var curDayTempEl = $('<p id="curTemp" >' + curDayTemp + '&#176;</p>')
                var curDayFeelEl = $('<p id="curFeel"><span>Feels Like:</span> ' + Math.round(curDayFeel) + '&#176;</p>')
                var curDayHighEl = $('<p id="curDayHi" class="curDayHiLo"><span>High:</span> ' + curDayHigh + '&#176;</p>')
                var curDayLowEl = $('<p id="curDayLo" class="curDayHiLo"><span>Low:</span> ' + curDayLow + '&#176</p>')
                var curDayUVEl = $('<div id="curDayUV"><p ><span>UV Index:</span> ' + curDayUV + '</p></div>')
                var curDayHumidityEl = $('<p id="curDayHumidity" class="curDayHiLo"><span>Humidity:</span> ' + curDayHumidity + '&#x25;</p>')
                var curDayWindEl = $('<p id="curDayWind" class="curDayHiLo"><span>Wind Speed:</span> ' + curDayWindSpeed + ' MPH</p>')
                var trimCurDetail = curDayDetail.replace(/\s+/g, '');
                var trimCity = respName.replace(/\s+/g, '');
                var curFocusStyles = {
                    backgroundImage: "url(https://loremflickr.com/900/900/" + trimCurDetail + "," + trimCity + ";",
                    boxShadow: "1px 4px 11px 4px rgba(0, 0, 0, 0.34);",
                }

                //Appending Header
                $('#curFocusHeader').append(curDayDescEl);
                $('#curFocusHeader').append(curDayDetailEl);
                //Appending Left Panel
                $('#curFocusHeader').append(imgIcon)
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
                $('#wrapper').css(curFocusStyles);

                $(function() {
                    if (curDayUV <= 2) {
                        $('#curDayUV p').removeClass('uvDanger uvHigh uvCaution');
                        $('#curDayUV p').addClass('uvClear');
                    } else if (curDayUV >= 3 && curDayUV <= 5) {
                        $('#curDayUV p').removeClass('uvDanger uvHigh uvClear');
                        $('#curDayUV p').addClass('uvCaution');
                    } else if (curDayUV >= 6 && curDayUV <= 7) {
                        $('#curDayUV p').removeClass('uvDanger uvCaution uvClear');
                        $('#curDayUV p').addClass('uvHigh');
                    } else {
                        $('#curDayUV p').removeClass('uvHigh uvClear uvCaution');
                        $('#curDayUV p').addClass('uvDanger')
                    }

                })

                $(function() {
                    //Add icon depending on weather
                    if (curDayDesc.indexOf("Cloud") >= 0) {
                        imageIcon.src = "assets/images/cloud.png"
                        imageIcon.css('backgroundColor:white;')
                    } else if (curDayDesc.indexOf("Snow") >= 0) {
                        imageIcon.src = "assets/images/snow.png"
                    } else if (curDayDesc.indexOf("Rain") >= 0) {
                        imageIcon.src = "assets/images/rain.png"
                    } else {
                        imageIcon.src = "assets/images/clear.png"
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

$('.btn').on('click', validate);