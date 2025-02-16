const wordAmount = document.getElementById("wordAmount");
const fontSize = document.getElementById("fontSize");
const originalButton = document.getElementById("originalAmount");
const paragraphCheck = document.getElementById("paragraphs");
const wordCount = document.getElementById("wordCount");
const letterCount = document.getElementById("letterCount");

const loremIpsum = [
  "Lorem ipsum dolor sit amet.",
  "Consectetur adipiscing elit.",
  "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Excepteur sint occaecat cupidatat non proident.",
  "Sunt in culpa qui officia deserunt mollit anim id est laborum.",
];

function generateLorem(wordCount, paragraphs) {
  let output = loremIpsum[0];
  let paragraphCount = wordCount / 150;
  while (output.split(" ").length < wordCount) {
    randSentence = loremIpsum[Math.floor(Math.random() * loremIpsum.length)];
    if (wordCount > randSentence.split(" ").length) {
      output += " " + randSentence;
    } else {
      if (wordCount > loremIpsum[3].split(" ").length) {
        output += " " + loremIpsum[3];
      } else {
        output += " " + randSentence.slice(0, wordCount) + ".";
      }
    }
  }

  if (paragraphs) {
    let outputArray = output.split(".");
    for (let i = 0; i < paragraphCount; i++) {
      if (i === 0) continue;
      outputArray[Math.ceil(outputArray.length * (i / paragraphCount))] +=
        ".\n\n";
    }
    outputArray.pop();
    output = outputArray.join(".").replace(/\n\n\. /g, "\n\n");
  }

  return output;
}

function generate() {
  const wordVal = wordAmount.value;
  const fontVal = fontSize.value;

  const loremOuput = generateLorem(wordVal, paragraphCheck.checked);

  const wordCount = document.getElementById("wordCount");
  const letterCount = document.getElementById("letterCount");

  wordCount.innerHTML = loremOuput.split(" ").length;
  letterCount.innerHTML = loremOuput.length;

  const output = document.getElementById("loremOutput");
  output.style.fontSize = fontVal + "px";
  output.value = loremOuput;
}

wordAmount.addEventListener("input", generate);
fontSize.addEventListener("input", generate);
paragraphCheck.addEventListener("input", generate);

originalButton.addEventListener("click", function () {
  wordAmount.value = 145;
  fontSize.value = 14;
  paragraphCheck.checked = true;
  generate();
});

document.getElementById("reseed").addEventListener("click", function () {
  generate();
});

document.getElementById("copyLorem").addEventListener("click", function () {
  const textToCopy = document.getElementById("loremOutput").value;
  const textArea = document.createElement("textarea");
  textArea.value = textToCopy;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  textArea.remove();
  toast("Copied to clipboard", 0, "clipboard", 250);
});

document.getElementById("saveLorem").addEventListener("click", function () {
  const textToSave = document.getElementById("loremOutput").value;
  const blob = new Blob([textToSave], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `loremIpsum.txt`;
  a.click();
  URL.revokeObjectURL(url);
  toast("Saved as " + a.download, 0, "file-text", 1000);
});

generate();
