// var xhr = new XMLHttpRequest();

// xhr.onreadystatechange = function() {
//   if (xhr.readyState === XMLHttpRequest.DONE) {
//     if (xhr.status === 200) {
//         var result = JSON.parse(xhr.response);
//         var movies = result[0];
//         var movie = movies[0];
//     } else {
//       // There was an error with the request.
//     }
//   }
// };

// xhr.open('GET', 'https://localhost:8080/admin/get_all_movies');
// xhr.send();

// function httpGet(id)
// {
//     var xmlHttp = new XMLHttpRequest();
//     xmlHttp.open( "GET", `https://localhost:8080/movie/get?id=${id}`, false ); // false for synchronous request
//     xmlHttp.send( null );
//     return xmlHttp.responseText;
// }

 function movieSelectChanged() {
  var select = document.getElementById("movie-selector");
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
    xhr.open("GET", `https://localhost:8080/movie/get?id=${id}`,false);
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
