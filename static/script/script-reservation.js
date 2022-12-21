function toReserveMoviePage() {
  window.location.assign(window.location.pathname+"/reservation"+window.location.search);
}

const container = document.querySelector(".container");
// Seat click event
container.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("seat") &&
    !e.target.classList.contains("sold")
  ) {
    e.target.classList.toggle("selected");
  }
});


function getData(){
  var xhr = new XMLHttpRequest();

  xhr.open("POST", `https://localhost:8080/movie/reservation/getData`+window.location.search,false);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
          return xhr.responseText;
      } else {
        // There was an error with the request.
      }
    }
  };
  xhr.send();
  return xhr.responseText;
}
function timeTable(data){

  var options=document.getElementById("timeTable")

  data.sort((a, b) => a.day - b.day);
  days=[...new Set(data.map(object => object.day))];
  var innerHtml=''
  const daysList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  for(day of days){

    innerHtml+='<div class="row-fluid separator time-row"><div class="span2 date-desc">'+
            `<span class="date-desc-label" id=${day}>${daysList[day-1]}</span>`+
            '</div>'+
            '<div class="span10">'
    for(var i=0; i< data.length;i++){
      if(data[i].day===day){

          const id=data[i].hallId*1000+data[i].movieId*100+data[i].day*10+data[i].time;
          if(data[i].availableCapacity===0){
          
          }

          innerHtml+='<div class="row-fluid start-times">'+
                      '<div class="span3 enable">'




            if(data[i].availableCapacity===0){

             innerHtml+= `<input name="session" type="radio" name="radioChecker" id=${id} value=${id} disabled  required>`+
                            `<label id="table-radio " style="
                            background-color: rgba(255, 0, 0, 0.293);" for=${id} >`+
                                `<p class="time-desc"> SOLD OUT<span><i class="fa fa-ticket-alt red" ></i></span></p>`+

                            '</label> '  +
                            '</div>'+
                          '</div>'
            }else{
              innerHtml+=`<input name="session" type="radio" name="radioChecker" id=${id} value=${id} enabled required>`+
                            `<label id="table-radio" for=${id}>`+
                                `<p class="time-desc"> ${data[i].time*3+8}:00<span><i class="fa fa-ticket-alt red" ></i></span></p>`+
                                `<p class="room-desc">Hall num: ${data[i].hallId}</p>`+
                            '</label> '  +
                            '</div>'+
                          '</div>'
            }
      }          
    }
    innerHtml+='</div></div>'
  }
  innerHtml+='</div>'
  options.innerHTML=innerHtml;
}

function loadData(){
  const data=JSON.parse(getData());
  const userData=data[0]
  timeTable(data[1])
  console.log(data)
  if(userData){
    var fullName=userData.name.split(" ");
    var email=userData.email;
    var birthdate=userData.birthdate.split(" ").at(0);
    var phoneNumber=userData.phoneNumber;
    var firstName=fullName.at(0)    
    
    if(fullName.length>1){
      fullName.shift();
    }

    var lastName= fullName.join(" ");

    document.getElementById("first").name="first";
    document.getElementById("first").value=firstName;
    document.getElementById("first").disabled=true;

    document.getElementById("last").name="last";
    document.getElementById("last").value=lastName;
    document.getElementById("last").disabled=true;

    document.getElementById("email").value=email;
    document.getElementById("email").disabled=true;
    document.getElementById("email").name="email";

    document.getElementById("phoneNumber").value=phoneNumber;
    document.getElementById("phoneNumber").disabled=true;
    document.getElementById("phoneNumber").name="phoneNumber";

    document.getElementById("birthdate").value=birthdate;
    document.getElementById("birthdate").disabled=true;
    document.getElementById("birthdate").name="birthdate";
  }
}

function getHallCapacity(id){
  var xhr = new XMLHttpRequest();

  xhr.open("POST", `https://localhost:8080/movie/reservation/getSeats?id=${id}`,false);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
          return xhr.responseText;
      } else {
        // There was an error with the request.
      }
    }
  };
  console.log(xhr.responseURL);
  xhr.send();
  return xhr.responseText;
}
function loadHallData(id){
  const data=JSON.parse(getHallCapacity(id));
  var options=document.getElementById("theater")
  innerHtml='<div class="screen"></div>';
  var capacity=data[0].capacity
  var bookedSeats= data[1].map(obj => obj.id);


  let division= Math.floor(capacity/10)
  for(var i=0;i< division;i++){
    innerHtml+='<div class="row">'
    for(var j=0;j< 10;j++){
      if(i*10+j in bookedSeats){
        innerHtml+=`<div class="col-2"><input class="checkbox" type="checkbox" id=${i*10+j} name="selectedSeat" value=${i*10+j} disabled>
        <label for=${i*10+j}><div class="col-3 w-30 seat sold" id=${i*10+j} ></div></label></div>`
      }else{
        innerHtml+=`<div class="col-2"><input class="checkbox" type="checkbox" id=${i*10+j} name="selectedSeat" value=${i*10+j}>
        <label for=${i*10+j}><div class="col-3 w-30 seat" id=${i*10+j} ></div></label></div>`
      }
      }

    innerHtml+=`</div>`
  }
  options.innerHTML=innerHtml;
}


loadData()
currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab



function showTab(n) {
  // This function will display the specified tab of the form ...
  var x = document.getElementsByClassName("tab");
  x[n].style.display = "block";
  // ... and fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    document.getElementById("nextBtn").innerHTML = "Submit";
  } else {
    document.getElementById("nextBtn").innerHTML = "Next";
  }
  // ... and run a function that displays the correct step indicator:
  fixStepIndicator(n)
}

function nextPrev(n) {
  // This function will figure out which tab to display
  var x = document.getElementsByClassName("tab");
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;
  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  if(currentTab===3){
    let a = document.querySelectorAll("input[type=radio]")
    for(object of a){
      if(object.checked===true){
        loadHallData(object.id)
      }
    }
  }
  // if you have reached the end of the form... :
  if (currentTab >= x.length) {
    //...the form gets submitted:
    document.getElementById('regForm').submit()
    return false;
  }
  // Otherwise, display the correct tab:
  showTab(currentTab);
}

function validateForm() {
  // This function deals with validation of the form fields
  var x, y, i, valid = true;
  x = document.getElementsByClassName("tab");
  y = x[currentTab].getElementsByTagName("input");
  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
    // If a field is empty...
    if (y[i].value == "") {
      // add an "invalid" class to the field:
      y[i].className += " invalid";
      // and set the current valid status to false:
      valid = false;
    }
  }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
}

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class to the current step:
  x[n].className += " active";
}