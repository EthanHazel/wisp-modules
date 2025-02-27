const INPUT = document.getElementById("input");
const OUTPUT = document.getElementById("output");

const MODE = document.querySelectorAll('input[name="mode"]');

const COPY_BUTTON = document.getElementById("copy-button");
const PASTE_BUTTON = document.getElementById("paste-button");
const CLEAR_BUTTON = document.getElementById("clear-button");
const SAVE_BUTTON = document.getElementById("save-button");

function convertCase(text) {
  const mode = document.querySelector('input[name="mode"]:checked').value;
  if (mode === "upper") {
    return text.toUpperCase();
  } else if (mode === "lower") {
    return text.toLowerCase();
  } else if (mode === "title") {
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  } else if (mode === "sentence") {
    return text
      .split(".")
      .map((sentence) => {
        const trimedSentence = sentence.trim();
        return trimedSentence.charAt(0).toUpperCase() + trimedSentence.slice(1);
      })
      .join(". ");
  }
}

INPUT.addEventListener("input", function () {
  OUTPUT.value = convertCase(INPUT.value);
});

MODE.forEach((input) => {
  input.addEventListener("change", function () {
    OUTPUT.value = convertCase(INPUT.value);
  });
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
      OUTPUT.value = convertCase(text);
    })
    .catch((err) => {
      console.error("Error: ", err);
    });
});

CLEAR_BUTTON.addEventListener("click", function () {
  INPUT.value = "";
  OUTPUT.value = "";
});

SAVE_BUTTON.addEventListener("click", function () {
  const blob = new Blob([OUTPUT.value], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `text-case.txt`;
  a.click();
  URL.revokeObjectURL(url);
  toast("Saved as " + a.download, 0, "file-text", 1000);
});
