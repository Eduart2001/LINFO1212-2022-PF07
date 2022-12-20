
function getHallTimeTable(id){
  var xhr = new XMLHttpRequest();
  xhr.open("POST", `https://localhost:8080/hall/timetable/get?id=${id}`,false);
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
function myFunction(i){
    let a=document.querySelectorAll('input[name="radio-overview"]');
    let selected =document.getElementsByClassName('slot selected');
    if(selected!=null || selected!=undefined){
        if(selected.length!=0){
            document.getElementById(selected[0].id).className="slot";
        }
    }
    document.getElementById(i).className = "slot selected";

    console.log(document.getElementById(i).className)
}