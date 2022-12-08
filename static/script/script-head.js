/*
    code pour charger le bon css pour chaque page
    by default ""
*/




var path = window.location.pathname;
var page = path.split("/").pop();
console.log(page)
try{
    document.getElementById("style").href="../css/"+page+".css"
}catch (e){
    console.log(e);
}

