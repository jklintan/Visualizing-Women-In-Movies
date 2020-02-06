

d3.json("./data/movieData.json", function (movieData) {

    console.log(movieData[0].imdbId);

    var movieArray = new Array();

    for(var i = 0; i < movieData.length; i++){
        movieArray[i] = movieData[i].imdbId;
    }
    console.log(movieArray);

    for(var i = 1; i < 5; i ++){
        var posterUrl = movieData[i].Poster;
        const imgElement = document.createElement('img')
        imgElement.src = posterUrl;
        document.body.appendChild(imgElement);  
    }
    
});