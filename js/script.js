var all_country_names = [];
var all_country_flags_dict = {};
var all_country_info_dict = {};
var all_country_currency_code_dict = {};

async function getAllCountryInfo() {
  let all_country_info = await fetch("https://restcountries.com/v3.1/all");
  all_country_data = await all_country_info.json();

  for (let country_data of all_country_data) {
    all_country_names.push(country_data.name.common)
    all_country_flags_dict[country_data.name.common] = country_data.flags.png
    all_country_info_dict[country_data.name.common] = [country_data.capital, country_data.population]
    try {
    all_country_currency_code_dict[country_data.name.common] = Object.keys(country_data.currencies)[0]
    } catch (error) {
    all_country_currency_code_dict[country_data.name.common] = null
    } 
  }
  return all_country_data
}

var all_country_data = getAllCountryInfo();

 
async function fetchExchangeRatesForPastMonths(country_currency) {
    try {
  
      const currentDate = new Date();
      var resultContainer = document.createElement('div');
      resultContainer.setAttribute("style", "margin-top: 10px;")
      
      const exchangeRateDataArray = [];
     
      const table = document.createElement('table');
      table.className = 'table table-bordered table-striped';
  
      
      const headerRow = table.insertRow(0);
      const dateHeader = headerRow.insertCell(0);
      const currencyCodeHeader = headerRow.insertCell(1);
  
      dateHeader.textContent = 'Date';
      currencyCodeHeader.textContent = 'Currency Value VS Euros';
  
      for (let i = 0; i < 5; i++) {
        const pastDate = new Date();
        pastDate.setMonth(currentDate.getMonth() - i);
        pastDate.setDate(pastDate.getDate() - 2);
        
        const formattedDate = pastDate.toISOString().split('T')[0];
  
        const apiUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/${formattedDate}/currencies/eur/${country_currency.toLowerCase()}.json`;
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
        currencyCodeCell.textContent = exchangeRateData[country_currency.toLowerCase()];
      }
      
      resultContainer.append(table);
      localStorage.setItem('exchangeRateData', JSON.stringify(exchangeRateDataArray));
      return resultContainer
    
  
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
function display_basic_info(country_one_element, country_two_element) {
  let country_one_div = document.querySelector("#country1_output")
  country_one_div.innerHTML = ""
  let country_two_div = document.querySelector("#country2_output")
  country_two_div.innerHTML = ""

  let country_one_header = document.createElement('h3')
  country_one_header.setAttribute("class", "secondary-title")
  country_one_header.innerText = country_one_element.value.toUpperCase();
  let country_two_header = document.createElement('h3')
  country_two_header.setAttribute("class", "secondary-title")
  country_two_header.setAttribute("class", "secondary-title")
  country_two_header.innerText = country_two_element.value.toUpperCase();

 // img element
  let country_one_img = document.createElement('img')
  country_one_img.setAttribute("src", `${all_country_flags_dict[country_one_element.value]}`)
  let country_two_img = document.createElement('img')
  country_two_img.setAttribute("src", `${all_country_flags_dict[country_two_element.value]}`)


  let country_one_info = document.createElement('h5')
  country_one_info.setAttribute("class", "third-title")
  country_one_info.innerHTML = `CAPITAL : ${all_country_info_dict[country_one_element.value][0][0].toUpperCase()} <br /> POPULATION : ${all_country_info_dict[country_one_element.value][1]} <br /> CURRECY : ${all_country_currency_code_dict[country_one_element.value]}`
  let country_two_info = document.createElement('h5')
  country_two_info.setAttribute("class", "third-title")
  country_two_info.innerHTML = `CAPITAL : ${all_country_info_dict[country_two_element.value][0][0].toUpperCase()} <br /> POPULATION : ${all_country_info_dict[country_two_element.value][1]} <br /> CURRECY : ${all_country_currency_code_dict[country_two_element.value]}`

  // save info in local storage

  country_one_div.append(country_one_img)
  country_one_div.append(country_one_header)
  country_one_div.append(country_one_info)
  country_two_div.append(country_two_img)
  country_two_div.append(country_two_header)
  country_two_div.append(country_two_info)

  return  [all_country_currency_code_dict[country_two_element.value], all_country_currency_code_dict[country_one_element.value]]


}
async function compareCountries() {
  let country_one_element = document.querySelector("#queryInput1");
  let country_two_element = document.querySelector("#queryInput2");
  if (all_country_names.includes(country_one_element.value) && all_country_names.includes(country_two_element.value)) {
    playAudio()
    currencies = display_basic_info(country_one_element, country_two_element)

    let display_table_button = document.createElement("button");
    display_table_button.setAttribute("class", "btn btn-outline-primary")
    display_table_button.innerText = "Compare Vs Euros"
    document.querySelector("#graph_and_table").append(display_table_button)
    country_one_currency = currencies[0]
    var response_div_1 = await fetchExchangeRatesForPastMonths(country_one_currency);
    country_two_currency = currencies[1]
    var response_div_2 = await fetchExchangeRatesForPastMonths(country_two_currency);

    // enable the button
    display_table_button.onclick = () => {
    display_table_button.innerText = "Visualize data"
    document.querySelector("#country1_output").append(response_div_1);
    document.querySelector("#country2_output").append(response_div_2);
    display_table_button.onclick = show_graph;
    }
   // get chart data generate chart

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
