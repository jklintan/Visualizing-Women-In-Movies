

d3.json("./data/imdb_data.json", function (data) {

    console.log(data[2].Poster);
    var url = data[2].Poster;

    var img = $('<img src=' + 'http://ia.media-imdb.com/images/M/MV5BMTQ5MDY0NDc3MV5BMl5BanBnXkFtZTcwODE4MjgyMQ@@._V1_SY98_CR1,0,67,98_AL_.jpg' + '/>');
    img.appendTo('body');

    //Call for sunburst js

})

