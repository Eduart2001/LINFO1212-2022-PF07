/**
 * Displays a tab of a tabbed form.
 * The function hides all the tab content elements, removes the "active" class from all the tab links, and displays the tab content element with the specified ID.
 * It also adds the "active" class to the clicked tab link.
 * 
 * @param {Event} evt - The event that triggered the function call.
 * @param {string} cityName - The ID of the tab content element to display.
 * 
 * @returns {void}
 */
function openForm(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
    }


// enable dark mode//
let mode=document.getElementById("darkMode")


const enableDarkMode = () => {
    // 1. Add the class to the body
    document.body.classList.add('darkmode');
    // 2. Update darkMode in localStorage
    localStorage.setItem('darkMode', 'enabled');
  }
  
const disableDarkMode = () => {
    // 1. Remove the class from the body
    document.body.classList.remove('darkmode');
    // 2. Update darkMode in localStorage 
    localStorage.setItem('darkMode', null);
  }
  if (darkMode === 'enabled') {
    enableDarkMode();
}   
if(mode.checked===true){
    enableDarkMode();
}else{
    disableDarkMode();
}
mode.addEventListener('click', () => {
    // get their darkMode setting
    darkMode = localStorage.getItem('darkMode'); 
    
    // if it not current enabled, enable it
    if (darkMode !== 'enabled') {
      enableDarkMode();
    // if it has been enabled, turn it off  
    } else {  
      disableDarkMode(); 
    }
  });
