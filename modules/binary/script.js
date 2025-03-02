const TEXT_INPUT = document.getElementById("text-input");
const BINARY_OUTPUT = document.getElementById("binary-output");

const BINARY_INPUT = document.getElementById("binary-input");
const TEXT_OUTPUT = document.getElementById("text-output");

const COPY_BUTTON = document.getElementById("copy-button");
const PASTE_BUTTON = document.getElementById("paste-button");
const CLEAR_BUTTON = document.getElementById("clear-button");
const SAVE_BUTTON = document.getElementById("save-button");

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

function convertTextToBinary(text) {
  return text
    .split("")
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
    .join(" ");
}

function convertBinaryToText(binary) {
  return binary
    .split(" ")
    .map((bin) => String.fromCharCode(parseInt(bin, 2)))
    .join("");
}

TEXT_INPUT.addEventListener("input", function () {
  const text = this.value;
  BINARY_OUTPUT.value = convertTextToBinary(text);
});

BINARY_INPUT.addEventListener("input", function () {
  const binary = this.value;
  TEXT_OUTPUT.value = convertBinaryToText(binary);
});

COPY_BUTTON.addEventListener("click", function () {
  const textToCopy =
    getCurrentMode() === "textToBinary"
      ? BINARY_OUTPUT.value
      : TEXT_OUTPUT.value;
  copyTextToClipboard(textToCopy, false);
});

PASTE_BUTTON.addEventListener("click", async function () {
  try {
    const text = await getClipboardText();
    const mode = getCurrentMode();
    if (mode === "textToBinary") {
      TEXT_INPUT.value = text;
      BINARY_OUTPUT.value = convertTextToBinary(text);
    } else if (mode === "binaryToText") {
      BINARY_INPUT.value = text;
      TEXT_OUTPUT.value = convertBinaryToText(text);
    }
  } catch (err) {
    console.error("Error: ", err);
  }
});

CLEAR_BUTTON.addEventListener("click", function () {
  const mode = getCurrentMode();
  if (mode === "textToBinary") {
    TEXT_INPUT.value = "";
    BINARY_OUTPUT.value = "";
  } else if (mode === "binaryToText") {
    BINARY_INPUT.value = "";
    TEXT_OUTPUT.value = "";
  }
});

SAVE_BUTTON.addEventListener("click", function () {
  const mode = getCurrentMode();
  const textToSave =
    mode === "textToBinary" ? BINARY_OUTPUT.value : TEXT_OUTPUT.value;
  saveTextToFile(textToSave, mode);
  toast(`Saved as ${mode}.txt`, 0, "file-text", 1000);
});
