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
  