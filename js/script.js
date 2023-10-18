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

function changeSoundMode() {
    let element = document.querySelector('#sound');
    let audio_element = document.querySelector("#my_audio");
    if (element.value == 'volume') {
        element.src = 'images/mute.png';
        element.value = 'mute';
        audio_element.muted = true
    } else {
    audio_element.muted = false
    element.src = 'images/volume.png'
    element.value = 'volume';
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
}