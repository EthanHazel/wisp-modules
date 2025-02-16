function getCurrentMode() {
  const tabIndex = getCurrentTabIndex("Convert");
  if (tabIndex === 0) {
    return "textToMorse";
  } else if (tabIndex === 1) {
    return "morseToText";
  } else {
    return null;
  }
}

const morseMap = {
  a: ".-",
  b: "-...",
  c: "-.-.",
  d: "-..",
  e: ".",
  f: "..-.",
  g: "--.",
  h: "....",
  i: "..",
  j: ".---",
  k: "-.-",
  l: ".-..",
  m: "--",
  n: "-.",
  o: "---",
  p: ".--.",
  q: "--.-",
  r: ".-.",
  s: "...",
  t: "-",
  u: "..-",
  v: "...-",
  w: ".--",
  x: "-..-",
  y: "-.--",
  z: "--..",
  0: "-----",
  1: ".----",
  2: "..---",
  3: "...--",
  4: "....-",
  5: ".....",
  6: "-....",
  7: "--...",
  8: "---..",
  9: "----.",
  " ": "/",
};

document.getElementById("text-input").addEventListener("input", function () {
  const text = this.value.toLowerCase();
  const morse = text
    .split("")
    .map((char) => morseMap[char] || "")
    .join(" ");
  document.getElementById("morse-output").value = morse;
});

document.getElementById("morse-input").addEventListener("input", function () {
  const morse = this.value.split(" ");
  const text = morse
    .map((code) => Object.keys(morseMap).find((key) => morseMap[key] === code))
    .join("");
  document.getElementById("text-output").value = text;
});

document.getElementById("copy-button").addEventListener("click", function () {
  const textToCopy =
    getCurrentMode() === "textToMorse"
      ? document.getElementById("morse-output").value
      : document.getElementById("text-output").value;
  const textArea = document.createElement("textarea");
  textArea.value = textToCopy;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  textArea.remove();
  toast("Copied to clipboard", 0, "clipboard", 250);
});

document.getElementById("paste-button").addEventListener("click", function () {
  navigator.clipboard
    .readText()
    .then((text) => {
      const mode = getCurrentMode();
      if (mode === "textToMorse") {
        document.getElementById("text-input").value = text;
        document.getElementById("morse-output").value = text
          .toLowerCase()
          .split("")
          .map((char) => morseMap[char] || "")
          .join(" ");
      } else if (mode === "morseToText") {
        document.getElementById("morse-input").value = text;
        document.getElementById("text-output").value = text
          .toLowerCase()
          .split(" ")
          .map((code) =>
            Object.keys(morseMap).find((key) => morseMap[key] === code)
          )
          .join("");
      }
    })
    .catch((err) => {
      console.error("Error: ", err);
    });
});

document.getElementById("clear-button").addEventListener("click", function () {
  const mode = getCurrentMode();
  if (mode === "textToMorse") {
    document.getElementById("text-input").value = "";
    document.getElementById("morse-output").value = "";
  } else if (mode === "morseToText") {
    document.getElementById("morse-input").value = "";
    document.getElementById("text-output").value = "";
  }
});

document.getElementById("save-button").addEventListener("click", function () {
  const mode = getCurrentMode();
  const textToSave =
    mode === "textToMorse"
      ? document.getElementById("morse-output").value
      : document.getElementById("text-output").value;
  const blob = new Blob([textToSave], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${mode}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  toast("Saved as " + a.download, 0, "file-text", 1000);
});
