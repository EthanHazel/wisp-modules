const CHECKBOX = document.getElementById("testDisableCheck");
const BUTTON = document.getElementById("testDisable");

CHECKBOX.addEventListener("change", function () {
  console.log(this.checked);
  if (this.checked) {
    BUTTON.disabled = true;
  } else {
    BUTTON.disabled = false;
  }
});
