function getCurrentMode() {
  const tabIndex = getCurrentTabIndex("Convert");
  if (tabIndex === 0) {
    return "textToBinary";
  } else if (tabIndex === 1) {
    return "binaryToText";
  } else {
    return null;
  }
}

document.getElementById("text-input").addEventListener("input", function () {
  const text = this.value;
  const binary = text
    .split("")
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
    .join(" ");
  document.getElementById("binary-output").value = binary;
});

document.getElementById("binary-input").addEventListener("input", function () {
  const binary = this.value;
  const text = binary
    .split(" ")
    .map((bin) => String.fromCharCode(parseInt(bin, 2)))
    .join("");
  document.getElementById("text-output").value = text;
});

document.getElementById("copy-button").addEventListener("click", function () {
  const textToCopy =
    getCurrentMode() === "textToBinary"
      ? document.getElementById("binary-output").value
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
      if (mode === "textToBinary") {
        document.getElementById("text-input").value = text;
        document.getElementById("binary-output").value = text
          .split("")
          .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
          .join(" ");
      } else if (mode === "binaryToText") {
        document.getElementById("binary-input").value = text;
        document.getElementById("text-output").value = text
          .split(" ")
          .map((bin) => String.fromCharCode(parseInt(bin, 2)))
          .join("");
      }
    })
    .catch((err) => {
      console.error("Error: ", err);
    });
});

document.getElementById("clear-button").addEventListener("click", function () {
  const mode = getCurrentMode();
  if (mode === "textToBinary") {
    document.getElementById("text-input").value = "";
    document.getElementById("binary-output").value = "";
  } else if (mode === "binaryToText") {
    document.getElementById("binary-input").value = "";
    document.getElementById("text-output").value = "";
  }
});
