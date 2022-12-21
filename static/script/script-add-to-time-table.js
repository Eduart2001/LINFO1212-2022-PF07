/**
 * Retrieves the timetable for a hall with a given ID from a server.
 * The function sends an HTTP POST request to a specified URL, with the ID of the hall as a query parameter.
 * It returns the response from the server as a string.
 * 
 * @param {number} id - The ID of the hall to retrieve the timetable for.
 * @returns {string} The response from the server.
 */
function getHallTimeTable(id){
  var xhr = new XMLHttpRequest();
  xhr.open("POST", `https://localhost:8080/hall/timetable/get?id=${id}`,false);
  xhr.onreadystatechange = function() {
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
 * Populates a table of radio buttons with the timetable for a selected hall.
 * The function gets the ID of the selected hall from a dropdown menu, calls the `getHallTimeTable(id)` function to retrieve the timetable data, and parses the resulting JSON string.
 * It then sets the values and labels of the radio buttons to the corresponding timetable data, and disables the buttons for occupied slots.
 * 
 */
function loadHallTimeTable(){
  var select = document.getElementById("hall-selector");
  var selectedOptionValue = select.options[select.selectedIndex].id;
  const hallTimeTable=JSON.parse(getHallTimeTable(selectedOptionValue));
  console.log(hallTimeTable)

  var radioButton = document.querySelectorAll('input[type="radio"]'); 
  var labels = document.querySelectorAll('label[id="table-radio"]');
  for(var i=1; i<= radioButton.length; i++){
    radioButton.item(i-1).value="Seance " +i;
    radioButton.item(i-1).id="Seance " +i;
    labels[i-1].for="Seance " +i;
    labels[i-1].innerHTML=i;
    radioButton.item(i-1).disabled=false;
  }

  for(var j=0; j< hallTimeTable.length; j++){
    var occupiedSpace =radioButton.item(hallTimeTable[j].day+hallTimeTable[j].time*7-1)
    occupiedSpace.disabled=true;
    labels[hallTimeTable[j].day+hallTimeTable[j].time*7-1].innerHTML=hallTimeTable[j].movieName
    occupiedSpace.value=hallTimeTable[j].movieId;
  }

}