/**
 * Redirects the user to the movie reservation page.
 */
function toReserveMoviePage() {
  window.location.assign(
    window.location.pathname + "/reservation" + window.location.search
  );
}

/**
 * The container element for the seating chart.
 */
const container = document.querySelector(".container");
let selected=0;
/**
 * Handles click events on seats in the seating chart.
 * Toggles the "selected" class for seats that are not already sold.
 * @param {Event} e The click event object.
 * @param {HTMLElement} container The container element that the event listener is attached to.
 */
container.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("seat") &&
    !e.target.classList.contains("sold")
  ) {
    e.target.classList.toggle("selected");
    selected-=1;
  }else{
    selected+=1;
  }
});

/**
 * Makes a POST request to the server to retrieve data.
 * @return {string} The data returned by the server.
 */
function getData() {
  var xhr = new XMLHttpRequest();

  xhr.open(
    "POST",
    `https://localhost:8080/movie/reservation/getData` + window.location.search,
    false
  );
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        return xhr.responseText;
      }
    }
  };
  xhr.send();
  return xhr.responseText;
}

/**
 * Makes a POST request to the server to retrieve the capacity of a movie hall.
 * @param {string} id The ID of the movie hall.
 * @return {string} The capacity of the movie hall.
 */
function getHallCapacity(id) {
  var xhr = new XMLHttpRequest();

  xhr.open(
    "POST",
    `https://localhost:8080/movie/reservation/getSeats?id=${id}`,
    false
  );
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        return xhr.responseText;
      }
    }
  };
  xhr.send();
  return xhr.responseText;
}

/**
 * Generates the timetable of the selected movie with the availability throw the week and displays it on the page.
 * @param {Array} data An array of objects containing information about the showings. Each object should have the following properties:
 *   - hallId {string}: The ID of the movie hall for the showing.
 *   - movieId {string}: The ID of the movie for the showing.
 *   - day {number}: The day of the week for the showing (1-7).
 *   - time {number}: The time of the showing (0-4).
 *   - availableCapacity {number}: The number of available seats for the showing.
 * @param {HTMLElement} options The element that the timetable will be added to.
 */
function timeTable(data) {
  var options = document.getElementById("timeTable");

  data.sort((a, b) => a.day - b.day);
  days = [...new Set(data.map((object) => object.day))];
  var innerHtml = "";
  const daysList = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  for (day of days) {
    innerHtml +=
      '<div class="row-fluid separator time-row"><div class="span2 date-desc">' +
      `<span class="date-desc-label" id=${day}>${daysList[day - 1]}</span>` +
      "</div>" +
      '<div class="span10">';
    for (var i = 0; i < data.length; i++) {
      if (data[i].day === day) {
        const id =
          data[i].hallId+"-"+
          data[i].movieId+"-"+
          data[i].day +"-"+
          data[i].time;
        if (data[i].availableCapacity === 0) {
        }

        innerHtml +=
          '<div class="row-fluid start-times">' + '<div class="span3 enable">';

        if (data[i].availableCapacity === 0) {
          innerHtml +=
            `<input name="session" type="radio" name="radioChecker" id=${id} value=${id} disabled  required>` +
            `<label id="table-radio " style="
                            background-color: rgba(255, 0, 0, 0.293);" for=${id} >` +
            `<p class="time-desc"> SOLD OUT<span><i class="fa fa-ticket-alt red" ></i></span></p>` +
            "</label> " +
            "</div>" +
            "</div>";
        } else {
          innerHtml +=
            `<input name="session" type="radio" name="radioChecker" id=${id} value=${id} enabled required>` +
            `<label id="table-radio" for=${id}>` +
            `<p class="time-desc"> ${
              data[i].time * 3 + 8
            }:00<span><i class="fa fa-ticket-alt red" ></i></span></p>` +
            `<p class="room-desc">Hall num: ${data[i].hallId}</p>` +
            "</label> " +
            "</div>" +
            "</div>";
        }
      }
    }
    innerHtml += "</div></div>";
  }
  innerHtml += "</div>";
  options.innerHTML = innerHtml;
}
/**
 * Loads data from the server via a the getData() function, the returned data is a JSON object, parses it, and populates form fields with the data.
 * The data consists of user information and a time table.
 * The user information is used to populate the following form fields:
 * - first name
 * - last name
 * - email
 * - phone number
 * - birthdate
 * These fields are disabled to prevent editing.
 * The time table is passed to the `timeTable()` function for further processing.
 *
 * @param {string} getData - A function that returns a string representation of the data in JSON format.
 * @returns {void}
 */
function loadData() {
  const data = JSON.parse(getData());
  const userData = data[0];
  timeTable(data[1]);
  console.log(data);
  if (userData) {
    var fullName = userData.name.split(" ");
    var email = userData.email;
    var birthdate = userData.birthdate.split(" ").at(0);
    var phoneNumber = userData.phoneNumber;
    var firstName = fullName.at(0);

    if (fullName.length > 1) {
      fullName.shift();
    }

    var lastName = fullName.join(" ");

    document.getElementById("first").name = "first";
    document.getElementById("first").value = firstName;
    document.getElementById("first").disabled = true;

    document.getElementById("last").name = "last";
    document.getElementById("last").value = lastName;
    document.getElementById("last").disabled = true;

    document.getElementById("email").value = email;
    document.getElementById("email").disabled = true;
    document.getElementById("email").name = "email";

    document.getElementById("phoneNumber").value = phoneNumber;
    document.getElementById("phoneNumber").disabled = true;
    document.getElementById("phoneNumber").name = "phoneNumber";

    document.getElementById("birthdate").value = birthdate;
    document.getElementById("birthdate").disabled = true;
    document.getElementById("birthdate").name = "birthdate";
  }
}
/**
 * Loads data about a movie theater and its booked seats, then generates an HTML representation of the theater layout.
 * The data is obtained by calling the `getHallCapacity(id)` function and parsing the resulting JSON string.
 * The theater layout consists of rows of seats, with each row containing up to 10 seats.
 * Booked seats are disabled and marked as "sold", while unbooked seats are enabled and available for selection.
 *
 * @param {number} id - The ID of the movie theater.
 * @returns {void}
 */
function loadHallData(id) {
  const data = JSON.parse(getHallCapacity(id));
  var options = document.getElementById("theater");
  innerHtml = '<div class="screen"></div>';
  var capacity = data[0].capacity;
  var bookedSeats = data[1].map((obj) => obj.id);

  let division = Math.floor(capacity / 10);
  for (var i = 0; i < division; i++) {
    innerHtml += '<div class="row">';
    for (var j = 0; j < 10; j++) {
      var result=i * 10 + j;
      if (bookedSeats.includes(result)) {
        innerHtml += `<div class="col-2"><input class="checkbox" type="checkbox" id=${
          result
        } name="selectedSeat" value=${result} disabled>
        <label for=${result}><div class="col-3 w-30 seat sold" id=${
          result
        } ></div></label></div>`;
      } else {
        innerHtml += `<div class="col-2"><input class="checkbox" type="checkbox" id=${
          result
        } name="selectedSeat" value=${result}>
        <label for=${result}><div class="col-3 w-30 seat" id=${
          result
        } ></div></label></div>`;
      }
    }

    innerHtml += `</div>`;
  }
  options.innerHTML = innerHtml;
}

//Loads and processes data.
loadData();

// Multiple step FORM code

// Current tab is set to be the first tab (0)
currentTab = 0;
showTab(currentTab); // Display the current tab

/**
 * Displays a specified tab of a multi-step form and updates the Previous/Next buttons and step indicator accordingly.
 * The function hides all tabs and shows the tab with the specified index.
 * If the tab is the first one, the Previous button is hidden.
 * If the tab is the last one, the Next button is changed to a Submit button.
 * Otherwise, the Next button is displayed as "Next".
 * The current step is updated by calling the `fixStepIndicator(n)` function.
 *
 * @param {number} n - The index of the tab to display, starting from 0.
 * @returns {void}
 */
function showTab(n) {
  var x = document.getElementsByClassName("tab");

  x[n].style.display = "block";

  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == x.length - 1) {
    document.getElementById("nextBtn").innerHTML = "Submit";
  } else {
    document.getElementById("nextBtn").innerHTML = "Next";
  }

  fixStepIndicator(n);
}
/**
 * Advances or goes back to the previous tab in a multi-step form, based on the value of `n`.
 * The function first checks if the current tab has any invalid fields, and if so, exits the function without advancing.
 * Otherwise, it hides the current tab, updates the current tab index, and displays the next or previous tab.
 * If the new tab is the last one, the form is submitted.
 *
 * @param {number} n - The number of tabs to advance or go back. A positive value advances the form, while a negative value goes back.
 * @returns {boolean} `false` if the form was submitted.
 */
function nextPrev(n) {
  var x = document.getElementsByClassName("tab");

  if (n == 1 && !validateForm()) return false;

  x[currentTab].style.display = "none";

  currentTab = currentTab + n;
  if (currentTab === 3) {
    let a = document.querySelectorAll("input[type=radio]");
    for (object of a) {
      if (object.checked === true) {
        loadHallData(object.id);
      }
    }
  }

  if (currentTab >= x.length) {
    document.getElementById("regForm").submit();
    return false;
  }

  showTab(currentTab);
}

/**
 * Validates the input fields of the current tab in a multi-step form.
 * The function checks if any of the fields are empty and adds the "invalid" class to them if they are.
 * If all fields are filled, the current step is marked as "finish".
 *
 * @returns {boolean} `true` if all fields are filled, `false` otherwise.
 */
function validateForm() {
  var x,y,i,valid = true;
  x = document.getElementsByClassName("tab");
  y = x[currentTab].getElementsByTagName("input");
  if(currentTab===2){
    let a = document.querySelectorAll("input[type=radio]");
    valid=false;
    for (object of a) {
      if (object.checked === true) {
        return true;
      }
    }
  }
  if(currentTab===3){
    if(selected<=0){
      return false;
    }
  }
  for (i = 0; i < y.length; i++) {
    if (y[i].value == "") {
      y[i].className += " invalid";

      valid = false;
    }
  }

  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid;
}

/**
 * Updates the display of a multi-step form to show which step the user is currently on.
 * The function removes the "active" class from all steps and adds it to the step with the specified index.
 *
 * @param {number} n - The index of the current step, starting from 0.
 * @returns {void}
 */
function fixStepIndicator(n) {
  var i;
  x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  x[n].className += " active";
}
