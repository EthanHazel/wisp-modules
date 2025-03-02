const TEXT_INPUT = document.getElementById("text-input");
const MORSE_OUTPUT = document.getElementById("morse-output");
const MORSE_INPUT = document.getElementById("morse-input");
const TEXT_OUTPUT = document.getElementById("text-output");
const COPY_BUTTON = document.getElementById("copy-button");
const PASTE_BUTTON = document.getElementById("paste-button");
const CLEAR_BUTTON = document.getElementById("clear-button");
const SAVE_BUTTON = document.getElementById("save-button");

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

const MORSE_MAP = {
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

TEXT_INPUT.addEventListener("input", function () {
  const text = this.value.toLowerCase();
  const morse = text
    .split("")
    .map((char) => MORSE_MAP[char] || "")
    .join(" ");
  MORSE_OUTPUT.value = morse;
});

MORSE_INPUT.addEventListener("input", function () {
  const morse = this.value.split(" ");
  const text = morse
    .map((code) =>
      Object.keys(MORSE_MAP).find((key) => MORSE_MAP[key] === code)
    )
    .join("");
  TEXT_OUTPUT.value = text;
});

COPY_BUTTON.addEventListener("click", function () {
  const textToCopy =
    getCurrentMode() === "textToMorse" ? MORSE_OUTPUT.value : TEXT_OUTPUT.value;
  copyTextToClipboard(textToCopy);
});

PASTE_BUTTON.addEventListener("click", async function () {
  const text = await getClipboardText();
  const mode = getCurrentMode();
  if (mode === "textToMorse") {
    TEXT_INPUT.value = text;
    MORSE_OUTPUT.value = text
      .toLowerCase()
      .split("")
      .map((char) => MORSE_MAP[char] || "")
      .join(" ");
  } else if (mode === "morseToText") {
    MORSE_INPUT.value = text;
    TEXT_OUTPUT.value = text
      .toLowerCase()
      .split(" ")
      .map((code) =>
        Object.keys(MORSE_MAP).find((key) => MORSE_MAP[key] === code)
      )
      .join("");
  }
});

CLEAR_BUTTON.addEventListener("click", function () {
  const mode = getCurrentMode();
  if (mode === "textToMorse") {
    TEXT_INPUT.value = "";
    MORSE_OUTPUT.value = "";
  } else if (mode === "morseToText") {
    MORSE_INPUT.value = "";
    TEXT_OUTPUT.value = "";
  }
});
SAVE_BUTTON.addEventListener("click", function () {
  const mode = getCurrentMode();
  const textToSave =
    mode === "textToMorse" ? MORSE_OUTPUT.value : TEXT_OUTPUT.value;
  saveTextToFile(textToSave, `${mode}`);
});
