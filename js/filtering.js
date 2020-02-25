//Filtering according to bechdel data

function filterSelection(c){
var selectedElements = document.getElementsByClassName(c)
var unknown = document.getElementsByClassName("N/A");
var fails = document.getElementsByClassName("0");
var pass = document.getElementsByClassName("1");
var x, i;
x = document.getElementById("techcircle");

if (c == "all"){ //Display all elements
  for (i = 0; i < fails.length; i++) {
    // fails[i].style.visibility = "visible";
    fails[i].style.fill = "#fff";
    fails[i].style.opacity = "0.5";
  }
  for (i = 0; i < pass.length; i++) {
    // pass[i].style.visibility = "visible";
    pass[i].style.fill = "#fff";
    pass[i].style.opacity = "0.5";
  }
  for (i = 0; i < unknown.length; i++) {
    //unknown[i].style.visibility = "visible";
    unknown[i].style.fill = "#fff";
    unknown[i].style.opacity = "0.5";
  }
}else if(c == "0"){
    for (i = 0; i < fails.length; i++) {
    //   fails[i].style.visibility = "hidden";
      fails[i].style.fill = "#8B0000";
    }
}else if(c == "1"){
    
    for (i = 0; i < pass.length; i++) {
    //   pass[i].style.visibility = "hidden";
        pass[i].style.fill = "#228B22";
    }
}else if(c == "N/A"){
    for (i = 0; i < unknown.length; i++) {
    //   unknown[i].style.visibility = "hidden";
      unknown[i].style.fill = "	#9ACD32";
    }
}
}


var btnContainer = document.getElementById("buttons");
var btns = btnContainer.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}