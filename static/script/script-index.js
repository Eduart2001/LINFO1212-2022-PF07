const e = require("express");
const sequelize=require("../../server/server_express").sequelize;
const Movie= require("../../server/server_express").Movie;

async function show_movies(){
    try{
        const[movies,meta]= await sequelize.query("SELECT * from Movies");
        return movies;
    }
    catch{
        return [];
    }
}

async function main_page(){
    let movies=show_movies();
    return {movies:movies};
}


async function add_movies_test(name){
    const array=[];

    array.push({
        movieName: name,
        description: "Jake Sully and Ney'tiri have formed a family and are doing everything to stay together. However, they must leave their home and explore the regions of Pandora. When an ancient threat resurfaces, Jake must fight a difficult war against the humans.",
        actors: "Sam Worthington & Zoe Saldaña",
        directors: "James Cameron",
        releaseDate: "2022-12-14",
        trailerURL:"jspkekeke",
        country: "USA",
        ageRestriction:"ALL",
        IMDBscore:"6.0",
        genre: "Action",
        duration: "190",
        poster: "../Posters/Avatar.jpg"
    });
    console.log(array[0]);
    return {data:array.slice};
}



module.exports={
    add_movies_test:add_movies_test(`Avatar 2`),
    main_page:main_page(),
    show_movies:show_movies(),
}
