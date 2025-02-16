function reverseText(text) {
  const mode = document.querySelector('input[name="mode"]:checked').id;

  if (mode === "characters") {
    return text.split("").reverse().join("");
  } else if (mode === "words") {
    return text.split(" ").reverse().join(" ");
  }
}

document.getElementById("text-input").addEventListener("input", function () {
  const text = this.value;
  document.getElementById("reverse-output").value = reverseText(text);
});

document.querySelectorAll('input[name="mode"]').forEach((input) => {
  input.addEventListener("change", function () {
    const text = document.getElementById("text-input").value;
    document.getElementById("reverse-output").value = reverseText(text);
  });
});

document.getElementById("copy-button").addEventListener("click", function () {
  const textToCopy = document.getElementById("reverse-output").value;
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
      document.getElementById("text-input").value = text;
      document.getElementById("reverse-output").value = reverseText(text);
    })
    .catch((err) => {
      console.error("Error: ", err);
    });
});

document.getElementById("clear-button").addEventListener("click", function () {
  document.getElementById("text-input").value = "";
  document.getElementById("reverse-output").value = "";
});

document.getElementById("save-button").addEventListener("click", function () {
  const textToSave = document.getElementById("reverse-output").value;
  const blob = new Blob([textToSave], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "reversed.txt";
  a.click();
  URL.revokeObjectURL(url);
  toast("Saved as reversed.txt", 0, "file-text", 1000);
});
