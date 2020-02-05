

d3.json("./data/movieData.json", function (data) {

    console.log(data[0]);

    //<img alt="Man of Steel Poster" title="Man of Steel Poster" src="https://m.media-amazon.com/images/M/MV5BMTk5ODk1NDkxMF5BMl5BanBnXkFtZTcwNTA5OTY0OQ@@._V1_UX182_CR0,0,182,268_AL_.jpg"></img>

    

    // d3.csv("./data/MovieGenre.csv", function (error, movieData) {
    //     console.log(movieData[0]);
    //     for(var i = 1; i < 8; i ++){
    //         var posterUrl = movieData[i].Poster;
    //         //console.log(imageExists(posterUrl));
    //         if(imageExists(posterUrl)){
    //             try {

    //                 var img = $('<img src=' + posterUrl   + " '/>'");
    //                 img.on('load', function(e){
    //                     console.log('Success!');
    //                 }).on('error', function(e) {
    //                     console.log('ERROR!');
    //                     return;
    //                 });
    //               }//end try
    //               catch (e) {
    //                   console.log("Error in image reading");
    //                   return;
    //               }
    //               img.appendTo('body');
    //         }else{
    //             console.log("Not displaying");
    //         }

  


    //     }

    // })

    // function imgError(image) {
    //     image.onerror = "";
    //     image.src = "/images/noimage.gif";
    //     return true;
    // }

    // function imageExists(image_url){
    //     var ret = image_url.replace('.jpg','');
    //     //console.log(ret); 


    //     try {
    //         var http = new XMLHttpRequest();
    //         //http.open('HEAD', ret, false);
    //         //http.send(null);
    //       }
    //       catch(err) {
    //         console.log("ERROR IN IMAGE, FIX OTHER IMAGE");
    //         return false;
    //       }

    //     return http.status != 404;
    // }
    //     // http.open('HEAD', ret, false);
    //     // if (http.statusCode === '404'){
    //     //     console.log("MAJOR ERROR")
    //     // }
    //     // http.onreadystatechange=function() {
    //     //     if (http.readyState === 4){   //if complete
    //     //         if(http.status === 200){  //check if "OK" (200)
    //     //             //success
    //     //             console.log("Success");

    //     //         } else {
    //     //             console.log("error"); //otherwise, some other code was returned
    //     //             return false;
    //     //         }
    //     //     } 
    //     // }

    //     // http.open('HEAD', image_url, false);
    //     // http.send();

    //     // http.open('HEAD', image_url, false);
    //     // http.send();
    
    //     // //return http.status != 404;
    //     // return true;


})

