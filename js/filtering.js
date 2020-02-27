//Filtering and changing color på movie circles according to bechdel data

function changeColor(c, button) {

  var unknown = document.getElementsByClassName("N/A");
  var fails = document.getElementsByClassName("0");
  var pass = document.getElementsByClassName("1");
  var i;

  //Check and uncheck the button
  if (button.className == "btn pass active" || button.className == "btn fail active" || button.className == "btn unknown active") {
    button.className = "btn"
  } else {
    button.className = "btn active"
  }

  //If not checked, reset all to original color
  if (button.className == "btn") {
    if (c == "1") {
      button.className = "btn pass"
      for (i = 0; i < pass.length; i++) {
        pass[i].style.fill = "#fff";
      }
    }
    if (c == "0") {
      button.className = "btn fail"
      for (i = 0; i < fails.length; i++) {

        fails[i].style.fill = "#fff";
      }
    }
    if (c == "N/A") {
      button.className = "btn unknown"
      for (i = 0; i < unknown.length; i++) {
        unknown[i].style.fill = "	#fff";
      }
    }
  }

  //Set color of button according to passing/failing/unknown
  if (button.className == "btn active") {
    if (c == "0") {
      button.className = "btn fail active"
      for (i = 0; i < fails.length; i++) {

        fails[i].style.fill = "#8B0000";
      }
    }
    if (c == "1") {
      button.className = "btn pass active"
      for (i = 0; i < pass.length; i++) {
        pass[i].style.fill = "#228B22";
      }
    }

    if (c == "N/A") {
      button.className = "btn unknown active"
      for (i = 0; i < unknown.length; i++) {
        unknown[i].style.fill = "	#9ACD32";
      }
    }
  }
};