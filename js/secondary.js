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