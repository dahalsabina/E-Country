var all_country_names = [];
async function getAllCountryInfo() {
  let all_country_info = await fetch("https://restcountries.com/v3.1/all");
  all_country_data = await all_country_info.json();

  for (let country_data of all_country_data) {
    all_country_names.push(country_data.name.common)
  }
  return all_country_data
}
var all_country_data = getAllCountryInfo();


async function fetchCurrencyInfo() {
    try {
      const countryInput = document.getElementById('countryInput').value.toLowerCase(); 
      const resultContainer = document.getElementById('currencyResult');
  
      resultContainer.textContent = '';
  
      if (!countryInput) {
        resultContainer.textContent = 'Please enter a country name.';
        return null;
      }
  
      const response = await fetch(`https://restcountries.com/v3.1/name/${countryInput}`);
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const countryData = await response.json();
  
      if (countryData.length === 0) {
        resultContainer.textContent = 'Country not found. Please check the spelling.';
        return null;
      }
  
      const currenciesInfo = countryData[0]?.currencies || {};
      const currencyCodes = Object.keys(currenciesInfo);
  
      if (currencyCodes.length > 0) {
        const currencyCode = currencyCodes[0].toLowerCase(); 
        resultContainer.textContent = `Currency Code: ${currencyCode}`;
        return currencyCode;
      } else {
        resultContainer.textContent = 'No currency information available for this country.';
        return null;
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
      return null;
    }
  }
  
  
  async function fetchExchangeRatesForPastMonths() {
    try {
      const currencyInfo = await fetchCurrencyInfo();
      if (!currencyInfo) {
        console.error('No currency code available.');
        return;
      }
  
      const currentDate = new Date();
      const resultContainer = document.getElementById('currencyResult');
  
      
      resultContainer.innerHTML = '';
      const exchangeRateDataArray = [];
  
     
      const table = document.createElement('table');
      table.className = 'table table-bordered';
  
      
      const headerRow = table.insertRow(0);
      const dateHeader = headerRow.insertCell(0);
      const currencyCodeHeader = headerRow.insertCell(1);
  
      dateHeader.textContent = 'Date';
      currencyCodeHeader.textContent = 'Currency Value compared to Base Eur';
  
      for (let i = 0; i < 5; i++) {
        const pastDate = new Date();
        pastDate.setMonth(currentDate.getMonth() - i);
  
        
        const formattedDate = pastDate.toISOString().split('T')[0];
  
        const apiUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/${formattedDate}/currencies/eur/${currencyInfo.toLowerCase()}.json`;
        console.log(`API URL for ${formattedDate}:`, apiUrl);
  
        const response = await fetch(apiUrl);
  
        if (!response.ok) {
          throw new Error('Error fetching exchange rate');
        }
  
        const exchangeRateData = await response.json();
        exchangeRateDataArray.push(exchangeRateData);
  
        
        const row = table.insertRow(i + 1);
        const dateCell = row.insertCell(0);
        const currencyCodeCell = row.insertCell(1);
  
        dateCell.textContent = exchangeRateData.date;
        currencyCodeCell.textContent = exchangeRateData[currencyInfo.toLowerCase()];
      }
  
      
      resultContainer.appendChild(table);
      localStorage.setItem('exchangeRateData', JSON.stringify(exchangeRateDataArray));
  
      
    } catch (error) {
      console.error('Error fetching exchange rates:', error.message);
    }
  }
  

function change_to_light_mode(html_element, img_element) {
    html_element.setAttribute("data-bs-theme", 'light');
    img_element.setAttribute("src", "images/darkness.png");
}

function change_to_dark_mode(html_element, img_element) {
    html_element.setAttribute("data-bs-theme", 'dark');
    img_element.setAttribute("src", "images/brightness.png");
}

function changeMode(){
    let element = document.querySelector("html");
    let imgElement = document.querySelector("#toggleMode")

    if (element.getAttribute("data-bs-theme") == 'dark'){
    change_to_light_mode(element, imgElement);
    window.localStorage.setItem("toggle_mode", "light");
    } else {
    change_to_dark_mode(element, imgElement);
    window.localStorage.setItem("toggle_mode", "dark");
    }

}
function changeSoundMode() {
  let element = document.querySelector('#sound');
  let audio_element = document.querySelector("#my_audio");
  console.log('here')
  if (element.value == 'volume') {
      element.src = 'images/mute.png';
      element.value = 'mute';
      audio_element.muted = true
  } else {
    audio_element.muted = false
    element.src = 'images/volume.png'
    element.value = 'volume';
  }}

function generateChart() {
    try {
      const resultContainer = document.getElementById('currencyResult');
  
      
      const exchangeRateDataArray = JSON.parse(localStorage.getItem('exchangeRateData'));
  
      if (!exchangeRateDataArray || exchangeRateDataArray.length !== 5) {
        throw new Error('Invalid or missing exchange rate data.');
      }
  
     
      const labels = exchangeRateDataArray.map(data => {
        const date = new Date(data.date);
        return `${date.toLocaleString('en-us', { month: 'short' })} ${date.getFullYear()}`;
      });
  
      
      const currencyInfo = (exchangeRateDataArray[0] && Object.keys(exchangeRateDataArray[0])[1]) || '';
      const yMinValue = 135; 
  
      const dataset = {
        backgroundColor: 'rgba(255, 150, 150, 0.5)',
        borderColor: 'rgb(255, 150, 150)',
        data: exchangeRateDataArray.map(data => data[currencyInfo.toLowerCase()]),
        label: 'Exchange Rate',
        fill: 'origin',
      };
  
      
      const chartConfig = {
        type: 'line',
        data: {
          labels: labels,
          datasets: [dataset],
        },
        options: {
          scales: {
            y: {
              beginAtZero: false,
              min: yMinValue,
            },
          },
        },
      };
  
      
      const chartUrl = `https://image-charts.com/chart.js/2.8.0?bkg=white&c=${encodeURIComponent(JSON.stringify(chartConfig))}`;
  
      
      const chartImage = document.createElement('img');
      chartImage.src = chartUrl;
  
      resultContainer.appendChild(chartImage);
  
      
     
    } catch (error) {
      console.error('Error generating chart:', error.message);
    }
  }

function playAudio() {

    audio_element = document.querySelector("#my_audio");
    if (document.querySelector('#sound').value == 'mute') {
        return}

    audio_element.muted = false
    audio_element.setAttribute("src" , "audio/money.mp3")
    audio_element.play()
    setTimeout(()=>{
        audio_element.setAttribute("src" , "")},8000
    )
}

function autoComplete(element) {
  inputElement = element.srcElement
  let id_ = null;
  if (inputElement.id == 'queryInput1') {
    id_ = 1;
  } else {
    id_ = 2;
  }

  let parent_element = document.querySelector(`#autoCompleteListDiv${id_}`);
  parent_element.innerHTML=""

  if (inputElement.value == ''){
    return
  }

  let grand_parent_element = document.querySelector("#resultContainer");

  for (let country_data of all_country_data) {
    if (country_data.name.common.toLowerCase().startsWith(inputElement.value.toLowerCase())) {

      div_element = document.createElement('div');
      div_element.setAttribute("class", "individual_name")

      strong_element = document.createElement("strong");
      strong_element.setAttribute("class" , `country_name_div${id_}`);
      strong_element.addEventListener("click", show_country_on_input)
      strong_element.innerHTML=country_data.name.common
      div_element.append(strong_element);
      parent_element.append(div_element);
    }
  }
}

function show_country_on_input(event) {
  element = event.srcElement;

  if (element.getAttribute("class") == 'country_name_div1') {
    document.querySelector("#queryInput1").value = element.innerText
    document.querySelector('#autoCompleteListDiv1').innerHTML = ""
  } else {
    document.querySelector("#queryInput2").value = element.innerText
    document.querySelector('#autoCompleteListDiv2').innerHTML = ""
  }
}
function compareCountries() {
  let country_one_element = document.querySelector("#queryInput1");
  let country_two_element = document.querySelector("#queryInput2");
  if (all_country_names.includes(country_one_element.value) && all_country_names.includes(country_two_element.value)) {
    playAudio()

  } else {
    // show warning if input is not valid
    let wariningdiv = document.querySelector("#warningContainer");
    wariningdiv.innerHTML = ''

    let div_element = document.createElement('div');
    div_element.setAttribute("class", "alert alert-warning alert-dismissible fade show")
    div_element.setAttribute("id", "warningDiv")
    div_element.setAttribute("role", "alert")
    div_element.innerText = "ERROR ! Select countries again"

    let button_element = document.createElement('button');
    button_element.setAttribute("class", "btn-close")
    button_element.setAttribute("onclick", "document.querySelector('#warningDiv').remove()")

    div_element.append(button_element);
    wariningdiv.append(div_element)
  }


}
window.onload = function () {

    // get local storage items and load them as necessary
    let element = document.querySelector("html");
    let imgElement = document.querySelector("#toggleMode")

    mode = window.localStorage.getItem("toggle_mode");
    if (mode == 'light') {
        change_to_light_mode(element, imgElement);
    } else {
        change_to_dark_mode(element, imgElement);
    } 
    
    var inputElement1 = document.querySelector('#queryInput1');
    var inputElement2 = document.querySelector('#queryInput2');
    inputElement1.addEventListener("input", autoComplete)
    inputElement2.addEventListener("input", autoComplete)
    // call all countrues and get them ready for search data
}
