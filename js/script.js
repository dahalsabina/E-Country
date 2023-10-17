function changeMode(){
    let element = document.querySelector("html");
    let imgElement = document.querySelector("#toggleMode")
    if (element.getAttribute("data-bs-theme") == 'dark'){
    element.setAttribute("data-bs-theme", 'light');
    imgElement.setAttribute("src", "images/darkness.png");
    } else {
    element.setAttribute("data-bs-theme", 'dark');
    imgElement.setAttribute("src", "images/brightness.png");
    }

    // add to local storage for the preference for next time too
}
async function fetchData(query) {
  var apiKey = '+8x8sQwrEimceQ4AvjzpnA==6MJHg4ldNrSlkasy';
  var apiUrl = 'https://api.api-ninjas.com/v1/nutrition?query=' + query;

  try {
      const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
              'X-Api-Key': apiKey,
              'Content-Type': 'application/json'
          }
      });

      const result = await response.json();

      // Save the result to local storage
      localStorage.setItem('nutritionData', JSON.stringify(result));

      return result;
  } catch (error) {
      throw new Error('Error:', error);
  }
}

async function displayNutritionalInfo(result) {
  var thead = document.querySelector('#nutritionTable thead');
  var tbody = document.querySelector('#nutritionTable tbody');

  // Clear existing content
  thead.innerHTML = '';
  tbody.innerHTML = '';

  if (result.length > 0) {
      // Create a header row
      var headerRow = document.createElement('tr');
      for (var key in result[0]) {
          var headerCell = document.createElement('th');
          headerCell.textContent = key.replace(/_/g, ' ');
          headerRow.appendChild(headerCell);
      }

      // Append the header row to the thead
      thead.appendChild(headerRow);

      // Create a data row for each item in the result array
      for (var i = 0; i < result.length; i++) {
          var dataRow = document.createElement('tr');

          // Iterate over the properties of each item and create a cell for each
          for (var key in result[i]) {
              var dataCell = document.createElement('td');
              dataCell.textContent = result[i][key];
              dataRow.appendChild(dataCell);
          }

          // Append the data row to the tbody
          tbody.appendChild(dataRow);
      }
  } else {
      // Display a message if no nutritional information is found
      resultContainer.innerHTML = '<p>No nutritional information found.</p>';
  }
}

document.getElementById('queryForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  var query = document.getElementById('queryInput').value;

  try {
      const result = await fetchData(query);
      await displayNutritionalInfo(result);
  } catch (error) {
      console.error(error);
  }
});
