/**
 * Populates form fields with the details of a selected movie.
 * The function gets the ID of the selected movie from a dropdown menu, calls the `getMovieById(id)` function to retrieve the movie data, and parses the resulting JSON string.
 * It then sets the value of various form fields to the corresponding movie data.
 * If the "none" option is selected, the form fields are not updated.
 * 
 * @returns {void}
 */
function movieSelectChanged() {
  var select = document.getElementById("movie-selector");
  var selectedOptionValue = select.options[select.selectedIndex].id;
  if (selectedOptionValue !== 'none'){
    var result = JSON.parse(getMovieById(Number(selectedOptionValue)));
    document.getElementById("movieName").value=result.movieName;
    document.getElementById("description").value=result.description;
    document.getElementById("date").value=new Date(result.releaseDate).toLocaleDateString('fr-CA')
    document.getElementById("directors").value=result.directors;
    document.getElementById("actors").value=result.actors;
    document.getElementById("duration").value=result.duration;
    document.getElementById("genre").value=result.genre;
    document.getElementById("trailerURL").value=result.trailerURL;
    document.getElementById("country").value=result.country;
    document.getElementById("age").value=result.ageRestriction;
    document.getElementById("imdb").value=result.IMDBscore;
    let file =document.getElementById("inputGroupFile")
    let path=`../Posters/${result.poster}`
    const newFile = new File([path], result.poster, { type: 'image/jpg' });
    file=newFile
    document.getElementById("frame").src="../Posters/"+result.poster;
    
  }
 return selectedOptionValue;
}
/**
 * Retrieves the data for a movie with a given ID from a server.
 * The function sends an HTTP GET request to a specified URL, with the ID of the movie as a query parameter.
 * It returns the response from the server as a string.
 * 
 * @param {number} id - The ID of the movie to retrieve.
 * @returns {string} The response from the server.
 */
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

    xhr.send(JSON.stringify({id:id}));
    return xhr.responseText;
}
