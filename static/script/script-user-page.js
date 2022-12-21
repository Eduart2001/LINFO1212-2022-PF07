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

