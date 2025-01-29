function getCurrentMode() {
  const tabIndex = getCurrentTabIndex("Convert");
  if (tabIndex === 0) {
    return "textToBase64";
  } else if (tabIndex === 1) {
    return "base64ToText";
  } else {
    return null;
  }
}

document.getElementById("text-input").addEventListener("input", function () {
  const text = this.value;
  const base64 = btoa(text);
  document.getElementById("base64-output").value = base64;
});

document.getElementById("base64-input").addEventListener("input", function () {
  const base64 = this.value;
  const text = atob(base64);
  document.getElementById("text-output").value = text;
});

document.getElementById("copy-button").addEventListener("click", function () {
  const textToCopy =
    getCurrentMode() === "textToBase64"
      ? document.getElementById("base64-output").value
      : document.getElementById("text-output").value;
  const textArea = document.createElement("textarea");
  textArea.value = textToCopy;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  textArea.remove();
});

document.getElementById("paste-button").addEventListener("click", function () {
  navigator.clipboard
    .readText()
    .then((text) => {
      const mode = getCurrentMode();
      if (mode === "textToBase64") {
        document.getElementById("text-input").value = text;
        document.getElementById("base64-output").value = btoa(text);
      } else if (mode === "base64ToText") {
        document.getElementById("base64-input").value = text;
        document.getElementById("text-output").value = atob(text);
      }
    })
    .catch((err) => {
      console.error("Error: ", err);
    });
});

document.getElementById("clear-button").addEventListener("click", function () {
  const mode = getCurrentMode();
  if (mode === "textToBase64") {
    document.getElementById("text-input").value = "";
    document.getElementById("base64-output").value = "";
  } else if (mode === "base64ToText") {
    document.getElementById("base64-input").value = "";
    document.getElementById("text-output").value = "";
  }
});
