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

copyButtonRegister([[COPY_BUTTON, OUTPUT]]);

PASTE_BUTTON.addEventListener("click", async function () {
  try {
    const text = await getClipboardText();
    INPUT.value = text;
    OUTPUT.value = replaceText(text, FIND.value, REPLACE.value);
  } catch (err) {
    console.error("Error: ", err);
  }
});

CLEAR_BUTTON.addEventListener("click", function () {
  INPUT.value = "";
  OUTPUT.value = "";
  FIND.value = "";
  REPLACE.value = "";
});

SAVE_BUTTON.addEventListener("click", function () {
  saveTextToFile(OUTPUT.value, "replaced");
});
