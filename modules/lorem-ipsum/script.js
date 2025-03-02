const WORD_AMOUNT = document.getElementById("word-amount");
const FONT_SIZE = document.getElementById("font-size");
const OG_BUTTON = document.getElementById("original-amount");
const PARAGRAPH_CHECK = document.getElementById("paragraphs");
const WORD_COUNT = document.getElementById("word-count");
const LETTER_COUNT = document.getElementById("letter-count");

const COPY_BUTTON = document.getElementById("copy-button");
const SAVE_BUTTON = document.getElementById("save-button");
const RESEED_BUTTON = document.getElementById("reseed");

const LOREM_OUTPUT = document.getElementById("lorem-output");

const LOREM_IPSUM = [
  "Lorem ipsum dolor sit amet.",
  "Consectetur adipiscing elit.",
  "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Excepteur sint occaecat cupidatat non proident.",
  "Sunt in culpa qui officia deserunt mollit anim id est laborum.",
];

function generateLorem(wordCount, paragraphs) {
  let output = LOREM_IPSUM[0];
  let paragraphCount = wordCount / 150;
  let prevSentence = LOREM_IPSUM[0];
  const sentences = LOREM_IPSUM.slice(1);
  while (output.split(" ").length < wordCount) {
    let randSentence;
    do {
      randSentence = sentences[Math.floor(Math.random() * sentences.length)];
    } while (randSentence === prevSentence);
    prevSentence = randSentence;
    if (wordCount > randSentence.split(" ").length) {
      output += " " + randSentence;
    } else {
      if (wordCount > LOREM_IPSUM[3].split(" ").length) {
        output += " " + LOREM_IPSUM[3];
      } else {
        output += " " + randSentence.slice(0, wordCount) + ".";
      }
    }
  }

  if (paragraphs) {
    const outputArray = output.split(".");
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
  const wordVal = WORD_AMOUNT.value;
  const fontVal = FONT_SIZE.value;

  const loremOuput = generateLorem(wordVal, PARAGRAPH_CHECK.checked);

  WORD_COUNT.innerHTML = loremOuput.split(" ").length;
  LETTER_COUNT.innerHTML = loremOuput.length;

  LOREM_OUTPUT.style.fontSize = fontVal + "px";
  LOREM_OUTPUT.value = loremOuput;
}

WORD_AMOUNT.addEventListener("input", generate);
FONT_SIZE.addEventListener("input", generate);
PARAGRAPH_CHECK.addEventListener("input", generate);

OG_BUTTON.addEventListener("click", function () {
  WORD_AMOUNT.value = 145;
  FONT_SIZE.value = 14;
  PARAGRAPH_CHECK.checked = true;
  generate();
});

RESEED_BUTTON.addEventListener("click", function () {
  generate();
});

copyButtonRegister([[COPY_BUTTON, LOREM_OUTPUT]]);

SAVE_BUTTON.addEventListener("click", function () {
  saveTextToFile(LOREM_OUTPUT.value, "loremIpsum");
});

generate();
