const WIDTH = document.getElementById("width");
const HEIGHT = document.getElementById("height");

const MODULE = document.getElementById("moduleFrame");

const ERROR = document.getElementById("error");

// Set width and height

setWidth(1280);
setHeight(720);

function setWidth(value) {
  WIDTH.value = value;
  document.getElementById("widthNum").value = value;

  MODULE.width = value + "px";

  checkError();
}

function setHeight(value) {
  HEIGHT.value = value;
  document.getElementById("heightNum").value = value;

  MODULE.height = value + "px";

  checkError();
}

function checkError() {
  const rect = MODULE.getBoundingClientRect();
  if (
    rect.width + "px" !== MODULE.width ||
    rect.height + "px" !== MODULE.height
  ) {
    ERROR.innerText =
      "Selected size is larger than your screen. Please select a smaller size or resize your screen.";
  } else {
    ERROR.innerText = "";
  }
}

// Sync width and height values with inputs

WIDTH.addEventListener("input", function () {
  setWidth(this.value);
});

document.getElementById("widthNum").addEventListener("input", function () {
  setWidth(this.value);
});

HEIGHT.addEventListener("input", function () {
  setHeight(this.value);
});

document.getElementById("heightNum").addEventListener("input", function () {
  setHeight(this.value);
});

// Button functionality

document.getElementById("desktop").addEventListener("click", function () {
  setWidth(1920);
  setHeight(1080);
});

document.getElementById("mobile").addEventListener("click", function () {
  setWidth(720);
  setHeight(1280);
});

window.addEventListener("resize", checkError);
