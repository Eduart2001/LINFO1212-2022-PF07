var express = require('express');
app =require("/server/server_express").app;
Movie =require("/server/server_express").Movie;

app.post('/add', async function(req, res, next){
    let form = req.body;
    Movie.create({
        movieName:form.movieName,
        description:form.description,
        releaseDate:form.releaseDate,
        trailerURL:form.trailerURL,
        country:form.country,
        ageRestriction:form.ageRestriction,
        IMDBscore:form.IMDBscore,
        genre:form.genre,
        duration:form.duration
    })
    res.redirect("/");
});