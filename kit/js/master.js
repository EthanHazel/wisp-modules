const WIDTH = document.getElementById("width");
const HEIGHT = document.getElementById("height");
const MODULE = document.getElementById("moduleFrame");
const SLUG = document.getElementById("slug");
const ERROR = document.getElementById("error");

// Function to set width and height
function setWidth(value) {
  WIDTH.value = value;
  document.getElementById("widthNum").value = value;
  MODULE.width = value + "px";
  localStorage.setItem("width", value); // Save width to localStorage
  checkError();
}

function setHeight(value) {
  HEIGHT.value = value;
  document.getElementById("heightNum").value = value;
  MODULE.height = value + "px";
  localStorage.setItem("height", value); // Save height to localStorage
  checkError();
}

function setSlug(value) {
  SLUG.value = value;
  localStorage.setItem("slug", value); // Save slug to localStorage
}

function loadModule(slug) {
  slug = slug.toLowerCase();
  slug = slug.replace(/ /g, "-");
  MODULE.src = "modules/" + slug + "/index.html";
  // Check if the module exists by seeing if the iframe gives an error
  fetch(MODULE.src).then((response) => {
    if (response.status === 404) {
      alert("Module not found");
      console.log(localStorage.getItem("slug"));
      setSlug(localStorage.getItem("slug"));
      loadModule(localStorage.getItem("slug"));
    } else {
      setSlug(slug);
    }
  });
}

// Function to check for errors
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

// Load saved values from localStorage on page load
window.addEventListener("load", function () {
  const savedWidth = localStorage.getItem("width");
  const savedHeight = localStorage.getItem("height");
  const savedSlug = localStorage.getItem("slug");

  if (savedWidth) {
    setWidth(savedWidth);
  } else {
    setWidth(1280); // Default width
  }

  if (savedHeight) {
    setHeight(savedHeight);
  } else {
    setHeight(720); // Default height
  }

  if (savedSlug) {
    setSlug(savedSlug);
  } else {
    setSlug(""); // Default slug
  }
});

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

document.getElementById("loadButton").addEventListener("click", function () {
  loadModule(SLUG.value);
});

document.getElementById("slug").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    document.getElementById("loadButton").click();
  }
});

window.addEventListener("resize", checkError);
