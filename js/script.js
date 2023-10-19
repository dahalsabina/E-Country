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

 
async function fetchExchangeRatesForPastMonths(country_currency, firstCall= true, localStorageload=false) {
  
      const currentDate = new Date();
      var resultContainer = document.createElement('div');
      resultContainer.setAttribute("style", "margin-top: 10px;")
      
      const exchangeRateDataArray = [];
     
      const table = document.createElement('table');
      table.className = 'table table-bordered table-striped';
      table.setAttribute("style", "border: 2px black;")
      
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
    
        if (localStorageload) {
            if (firstCall) {
              if (window.sessionStorage.getItem("exchangeRateData1")){
              var exchangeRateData = JSON.parse(window.sessionStorage.getItem("exchangeRateData1"))[i]
            }
            
              else {
                  var response = await fetch(apiUrl);
                  var exchangeRateData = await response.json();}
              }
            else {
              if (window.sessionStorage.getItem("exchangeRateData2")){
              var exchangeRateData = JSON.parse(window.sessionStorage.getItem("exchangeRateData2"))[i]}
              else {
                  var response = await fetch(apiUrl);
                  var exchangeRateData = await response.json();}
        }} else {
        var response = await fetch(apiUrl);
        var exchangeRateData = await response.json();}

      exchangeRateDataArray.push(exchangeRateData);
  
        
        const row = table.insertRow(i + 1);
        const dateCell = row.insertCell(0);
        const currencyCodeCell = row.insertCell(1);
  
        dateCell.textContent = exchangeRateData.date;
        currencyCodeCell.textContent = exchangeRateData[country_currency.toLowerCase()];
      }
      
      resultContainer.append(table);
      if (firstCall) {
      window.sessionStorage.setItem('exchangeRateData1', JSON.stringify(exchangeRateDataArray));}
      else {
      window.sessionStorage.setItem('exchangeRateData2', JSON.stringify(exchangeRateDataArray));}

      return resultContainer
  }

function generateChart(number_) {
      let id_ = `#country${number_}_output`;
      var resultContainer = document.querySelector(id_);
  
      const exchangeRateDataArray = JSON.parse(sessionStorage.getItem(`exchangeRateData${number_}`));
    
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
      chartImage.setAttribute("class", "graph")
      chartImage.src = chartUrl;
      resultContainer.append(chartImage);
      
     
  }

function display_basic_info(country_one_element, country_two_element, localStorageload = false) {
  document.querySelector("#graph_and_table").innerHTML = ""
  let country_one_div = document.querySelector("#country1_output")
  country_one_div.innerHTML = ""
  let country_two_div = document.querySelector("#country2_output")
  country_two_div.innerHTML = ""

  let country_one_header = document.createElement('h3')
  country_one_header.setAttribute("class", "secondary-title")
  let country_two_header = document.createElement('h3')
  country_two_header.setAttribute("class", "secondary-title")
  country_two_header.innerText = country_two_element.value.toUpperCase();
  country_one_header.innerText = country_one_element.value.toUpperCase();

 // img element
  let country_one_img = document.createElement('img')
  let country_two_img = document.createElement('img')
  if (localStorageload) {
  country_one_img.setAttribute("src", `${country_1_information.flag}`)
  country_two_img.setAttribute("src", `${country_2_information.flag}`)
  } else {
  country_one_img.setAttribute("src", `${all_country_flags_dict[country_one_element.value]}`)
  country_two_img.setAttribute("src", `${all_country_flags_dict[country_two_element.value]}`)
  }

  let country_one_info_dict = {};
  let country_two_info_dict = {};
  if (localStorageload) {
  country_one_info_dict.name = country_1_information.name
  country_one_info_dict.captial = country_1_information.capital
  country_one_info_dict.population = country_1_information.population
  country_one_info_dict.currency = country_1_information.currency
  country_one_info_dict.flag = country_1_information.flag

  country_two_info_dict.name = country_2_information.name
  country_two_info_dict.captial = country_2_information.capital
  country_two_info_dict.population = country_2_information.population
  country_two_info_dict.currency = country_2_information.currency
  country_two_info_dict.flag = country_2_information.flag

  } else {
  country_one_info_dict.name = country_one_element.value
  country_one_info_dict.captial = all_country_info_dict[country_one_element.value][0][0].toUpperCase()
  country_one_info_dict.population = all_country_info_dict[country_one_element.value][1]
  country_one_info_dict.currency = all_country_currency_code_dict[country_one_element.value]
  country_one_info_dict.flag = all_country_flags_dict[country_one_element.value]

  country_two_info_dict.name = country_two_element.value
  country_two_info_dict.captial = all_country_info_dict[country_two_element.value][0][0].toUpperCase()
  country_two_info_dict.population = all_country_info_dict[country_two_element.value][1]
  country_two_info_dict.currency = all_country_currency_code_dict[country_two_element.value]
  country_two_info_dict.flag = all_country_flags_dict[country_two_element.value]

  }
  let country_one_info = document.createElement('h5')
  country_one_info.setAttribute("class", "third-title")
  country_one_info.innerHTML = `CAPITAL : ${country_one_info_dict.captial} <br /> POPULATION : ${country_one_info_dict.population} <br /> CURRECY : ${country_one_info_dict.currency}`

  let country_two_info = document.createElement('h5')
  country_two_info.setAttribute("class", "third-title")
  country_two_info.innerHTML = `CAPITAL : ${country_two_info_dict.captial} <br /> POPULATION : ${country_two_info_dict.population} <br /> CURRECY : ${country_two_info_dict.currency}`

  window.localStorage.setItem("country_one_info", JSON.stringify(country_one_info_dict))
  window.localStorage.setItem("country_two_info", JSON.stringify(country_two_info_dict))

  country_one_div.append(country_one_img)
  country_one_div.append(country_one_header)
  country_one_div.append(country_one_info)
  country_two_div.append(country_two_img)
  country_two_div.append(country_two_header)
  country_two_div.append(country_two_info)

  if (localStorageload){
  return  [country_1_information.currency, country_2_information.currency]
  } else{
  return  [all_country_currency_code_dict[country_one_element.value], all_country_currency_code_dict[country_two_element.value]]
  }

}
async function show_graph() {
  let display_table_button = document.querySelector("#data_graph_button");
  generateChart(1);
  generateChart(2);
  display_table_button.remove();

}
async function compareCountries(localStorageload = false) {
  let country_one_element = document.querySelector("#queryInput1");
  let country_two_element = document.querySelector("#queryInput2");
  if (localStorageload || (all_country_names.includes(country_one_element.value) && all_country_names.includes(country_two_element.value))) {
    if (!localStorageload) {
    playAudio()
    }
    currencies = display_basic_info(country_one_element, country_two_element, localStorageload)

    let display_table_button = document.createElement("button");
    display_table_button.setAttribute("class", "btn btn-outline-primary")
    display_table_button.setAttribute("id", "data_graph_button")
    display_table_button.innerText = "Compare Vs Euros"
    document.querySelector("#graph_and_table").append(display_table_button)
    country_one_currency = currencies[0]
    country_two_currency = currencies[1]

    if (localStorageload) {
    var response_div_1 = await fetchExchangeRatesForPastMonths(country_one_currency, true, true);
    var response_div_2 = await fetchExchangeRatesForPastMonths(country_two_currency, false, true);}
     else {
    var response_div_1 = await fetchExchangeRatesForPastMonths(country_one_currency, true, false);
    var response_div_2 = await fetchExchangeRatesForPastMonths(country_two_currency, false);
    }

    // enable the button
    display_table_button.onclick = () => {
    display_table_button.innerText = "Visualize data"
    document.querySelector("#country1_output").append(response_div_1);
    document.querySelector("#country2_output").append(response_div_2);
    display_table_button.onclick = show_graph;
    }
  } // get chart data generate chart
  else {
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

    var inputElement1 = document.querySelector('#queryInput1');
    var inputElement2 = document.querySelector('#queryInput2');
    inputElement1.addEventListener("input", autoComplete)
    inputElement2.addEventListener("input", autoComplete)

    country_1_information = JSON.parse(window.localStorage.getItem("country_one_info"));
    country_2_information = JSON.parse(window.localStorage.getItem("country_two_info"));
    if ((!country_1_information) || (!country_2_information)) {
    } else {
      //display_info
      document.querySelector("#queryInput1").value = country_1_information.name
      document.querySelector("#queryInput2").value = country_2_information.name
      compareCountries(localStorageload = true);
    } 
 
}
