/**
 * Loads a stylesheet specific to the current page.
 * The function gets the current page from the URL, extracts the page name, and appends it to the URL of a stylesheet.
 * It then sets the `href` attribute of the `style` element to the resulting URL.
 * If an error occurs, it is logged to the console.
 * 
 */
var path = window.location.pathname;
var page = path.split("/").pop();
console.log(page)
try{
    document.getElementById("style").href="../css/"+page+".css"
}catch (e){
    console.log(e);
}

