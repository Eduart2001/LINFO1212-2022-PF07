async function add_movies_test(name){
    const array=[];

    array.push({
        movieName: name,
        description: "Pas mauvais film",
        releaseDate: "2022-01-17",
        trailerURL:"jspkekeke",
        country: "USA",
        ageRestriction:"ALL",
        IMDBscore:"6.0",
        genre: "Action",
        duration: "300",
    });
    console.log(array[0]);
    return {data:array};
}

module.exports={
    add_movies_test:add_movies_test(`Avatar 2`)
}
