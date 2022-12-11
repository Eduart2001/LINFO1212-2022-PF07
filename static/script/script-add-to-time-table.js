function hallSelectChanged() {
    var select = document.getElementById("hallSelector");
    var selectedOptionValue = select.options[select.selectedIndex].id;
    if (selectedOptionValue !== 'none'){
      var result = JSON.parse(getMovieById(Number(selectedOptionValue)));
      document.getElementById("movieName").value=result.movieName;
      document.getElementById("description").value=result.description;
      document.getElementById("date").value=new Date(result.releaseDate).toLocaleDateString('fr-CA')
      document.getElementById("duration").value=result.duration;
      document.getElementById("genre").value=result.genre;
      document.getElementById("trailerURL").value=result.trailerURL;
      document.getElementById("country").value=result.country;
      document.getElementById("age").value=result.ageRestriction;
      document.getElementById("imdb").value=result.IMDBscore;
    }
   
  }
function getMovieById(id) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", `https://localhost:8080/hall/timeTable/get?id=${id}`,false);
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