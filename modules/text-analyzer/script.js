const textInput = document.getElementById("text-input");

const charCount = document.getElementById("char-count");
const wordCount = document.getElementById("word-count");
const sentenceCount = document.getElementById("sentence-count");
const paragraphCount = document.getElementById("paragraph-count");

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
  charCount.innerHTML = this.value.length;
  wordCount.innerHTML = this.value.split(/[\s\n]+/).length;
  sentenceCount.innerHTML = this.value.split(".").length;
  paragraphCount.innerHTML = this.value.split("\n").length;

  updateMostUsedWords(getMostUsedWords(this.value));
  updateMostUsedCharacters(getMostUsedCharacters(this.value));
}

textInput.addEventListener("input", generate);

generate();
