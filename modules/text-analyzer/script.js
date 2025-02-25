const TEXT_INPUT = document.getElementById("text-input");

const PASTE_BUTTON = document.getElementById("paste-button");
const CLEAR_BUTTON = document.getElementById("clear-button");

const CHAR_COUNT = document.getElementById("char-count");
const WORD_COUNT = document.getElementById("word-count");
const SENTENCE_COUNT = document.getElementById("sentence-count");
const PARAGRAPH_COUNT = document.getElementById("paragraph-count");

const mostUsedWordsContainer = document.getElementById(
  "most-used-words-container"
);
const mostUsedCharactersContainer = document.getElementById(
  "most-used-characters-container"
);

function updateMostUsedWords(words) {
  mostUsedWordsContainer.innerHTML = "";
  words.forEach((word) => {
    const wordElement = document.createElement("span");
    wordElement.classList.add("container", "row", "w-100", "h-fit");
    wordElement.innerHTML = `<span>${word[0]}</span> <span class="txt-c-secondary">${word[1]}</span>`;
    mostUsedWordsContainer.appendChild(wordElement);
  });
}

function updateMostUsedCharacters(characters) {
  mostUsedCharactersContainer.innerHTML = "";
  characters.forEach((character) => {
    if (character[0] === " " || character[0] === "\n") return;
    const characterElement = document.createElement("span");
    characterElement.classList.add("container", "row", "w-100", "h-fit");
    characterElement.innerHTML = `<span>${character[0]}</span> <span class="txt-c-secondary">${character[1]}</span>`;
    mostUsedCharactersContainer.appendChild(characterElement);
  });
}

function getMostUsedWords(text) {
  const words = text
    .split(/[\s\n]+/)
    .map((word) => word.replace(/[^\w\s]/gi, ""));
  const wordCounts = words.reduce((acc, word) => {
    if (word === "") return acc;
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(wordCounts).sort((a, b) => b[1] - a[1]);
}

function getMostUsedCharacters(text) {
  const characters = text.split("");
  const characterCounts = characters.reduce((acc, character) => {
    acc[character] = (acc[character] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(characterCounts).sort((a, b) => b[1] - a[1]);
}

function generate() {
  const text = TEXT_INPUT.value;

  if (text === "") {
    CHAR_COUNT.innerHTML = 0;
    WORD_COUNT.innerHTML = 0;
    SENTENCE_COUNT.innerHTML = 0;
    PARAGRAPH_COUNT.innerHTML = 0;

    updateMostUsedWords([]);
    updateMostUsedCharacters([]);

    return;
  }

  CHAR_COUNT.innerHTML = text.length;
  WORD_COUNT.innerHTML = text
    .split(/[\s\n]+/)
    .filter((word) => word !== "").length;
  SENTENCE_COUNT.innerHTML = text
    .split(/[.!?]+/)
    .filter((sentence) => sentence !== "").length;
  PARAGRAPH_COUNT.innerHTML =
    text.split(/\n/).filter((paragraph) => paragraph.trim() !== "").length - 1;

  updateMostUsedWords(getMostUsedWords(text));
  updateMostUsedCharacters(getMostUsedCharacters(text));
}

PASTE_BUTTON.addEventListener("click", async () => {
  const text = await navigator.clipboard.readText();
  TEXT_INPUT.value = text;
  generate();
});

CLEAR_BUTTON.addEventListener("click", () => {
  TEXT_INPUT.value = "";
  generate();
});

TEXT_INPUT.addEventListener("input", generate);

generate();
