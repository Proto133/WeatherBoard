const apiKey = 'd10c1d7640a2ce7fdd5367e25b6d3962'
const baseUrl = 'https://api.openweathermap.org/data/2.5/forecast?id='
var labelIndex = 1
    //Store the recent city in localStorage
function storeRecent() {
    var userInput = $('#userSearch').val();
    localStorage.setItem('Recent Search ' + labelIndex, userInput);
    console.log(userInput)
    labelIndex++;
}

$('#searchBtn').on('click', storeRecent);