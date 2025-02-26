const INPUT = document.getElementById("input");
const OUTPUT = document.getElementById("output");

const FIND = document.getElementById("find");
const REPLACE = document.getElementById("replace");

const COPY_BUTTON = document.getElementById("copy-button");
const PASTE_BUTTON = document.getElementById("paste-button");
const CLEAR_BUTTON = document.getElementById("clear-button");
const SAVE_BUTTON = document.getElementById("save-button");

function replaceText(input, find, replace) {
  const escapedFind = find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return input.replace(
    new RegExp(escapedFind, "g"),
    replace.replace(/\\n/g, "\n")
  );
}

INPUT.addEventListener("input", function () {
  OUTPUT.value = replaceText(INPUT.value, FIND.value, REPLACE.value);
});

FIND.addEventListener("input", function () {
  OUTPUT.value = replaceText(INPUT.value, FIND.value, REPLACE.value);
});

REPLACE.addEventListener("input", function () {
  OUTPUT.value = replaceText(INPUT.value, FIND.value, REPLACE.value);
});

COPY_BUTTON.addEventListener("click", function () {
  const textArea = document.createElement("textarea");
  textArea.value = OUTPUT.value;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  textArea.remove();
  toast("Copied to clipboard", 0, "clipboard", 250);
});

PASTE_BUTTON.addEventListener("click", function () {
  navigator.clipboard
    .readText()
    .then((text) => {
      INPUT.value = text;
      OUTPUT.value = replaceText(text, FIND.value, REPLACE.value);
    })
    .catch((err) => {
      console.error("Error: ", err);
    });
});

CLEAR_BUTTON.addEventListener("click", function () {
  INPUT.value = "";
  OUTPUT.value = "";
  FIND.value = "";
  REPLACE.value = "";
});

SAVE_BUTTON.addEventListener("click", function () {
  const blob = new Blob([OUTPUT.value], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `replaced.txt`;
  a.click();
  URL.revokeObjectURL(url);
  toast("Saved as " + a.download, 0, "file-text", 1000);
});
