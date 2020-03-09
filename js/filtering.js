//Filtering and changing color på movie circles according to bechdel data

function changeColor(c, button) {

  console.log("clicking")
  console.log(button.checked)

  var unknown = document.getElementsByClassName("N/A");
  var fails = document.getElementsByClassName("0");
  var pass = document.getElementsByClassName("1");
  var i;

  if (!button.checked) {
    if (c == "1") {
      for (i = 0; i < pass.length; i++) {
        pass[i].style.fill = "#fff";
      }
    }
    if (c == "0") {
      for (i = 0; i < fails.length; i++) {

        fails[i].style.fill = "#fff";
      }
    }
    if (c == "N/A") {
      for (i = 0; i < unknown.length; i++) {
        unknown[i].style.fill = "	#fff";
      }
    }
  }

  if (button.checked) {
    if (c == "0") {
      for (i = 0; i < fails.length; i++) {
        fails[i].style.fill = "#992617";
      }
    }
    if (c == "1") {
      for (i = 0; i < pass.length; i++) {
        pass[i].style.fill = "#228043";
      }
    }

    if (c == "N/A") {
      for (i = 0; i < unknown.length; i++) {
        unknown[i].style.fill = "#de9b30";
      }
    }
  }
};