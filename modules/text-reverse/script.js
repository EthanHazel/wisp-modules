const TEXT_INPUT = document.getElementById("text-input");
const REVERSE_OUTPUT = document.getElementById("reverse-output");
const COPY_BUTTON = document.getElementById("copy-button");
const PASTE_BUTTON = document.getElementById("paste-button");
const CLEAR_BUTTON = document.getElementById("clear-button");
const SAVE_BUTTON = document.getElementById("save-button");
const MODE = document.querySelectorAll('input[name="mode"]');

function reverseText(text) {
  const mode = document.querySelector('input[name="mode"]:checked').id;

  if (mode === "characters") {
    return text.split("").reverse().join("");
  } else if (mode === "words") {
    return text.split(" ").reverse().join(" ");
  }
}

TEXT_INPUT.addEventListener("input", function () {
  const text = this.value;
  REVERSE_OUTPUT.value = reverseText(text);
});

MODE.forEach((input) => {
  input.addEventListener("change", function () {
    const text = TEXT_INPUT.value;
    REVERSE_OUTPUT.value = reverseText(text);
  });
});

copyButtonRegister([[COPY_BUTTON, REVERSE_OUTPUT]]);

PASTE_BUTTON.addEventListener("click", async function () {
  const text = await getClipboardText();
  TEXT_INPUT.value = text;
  REVERSE_OUTPUT.value = reverseText(text);
});

CLEAR_BUTTON.addEventListener("click", function () {
  TEXT_INPUT.value = "";
  REVERSE_OUTPUT.value = "";
});

SAVE_BUTTON.addEventListener("click", function () {
  const textToSave = REVERSE_OUTPUT.value;
  saveTextToFile(textToSave, "reversed");
});
