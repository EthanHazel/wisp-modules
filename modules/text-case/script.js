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

copyButtonRegister([[COPY_BUTTON, OUTPUT]]);

PASTE_BUTTON.addEventListener("click", async function () {
  const text = await getClipboardText();
  INPUT.value = text;
  OUTPUT.value = convertCase(text);
});

CLEAR_BUTTON.addEventListener("click", function () {
  INPUT.value = "";
  OUTPUT.value = "";
});

SAVE_BUTTON.addEventListener("click", function () {
  saveTextToFile(OUTPUT.value, `text-case.txt`);
});
