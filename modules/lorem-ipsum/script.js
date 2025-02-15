const wordAmount = document.getElementById("wordAmount");
const fontSize = document.getElementById("fontSize");
const originalButton = document.getElementById("originalAmount");
const wordCount = document.getElementById("wordCount");
const letterCount = document.getElementById("letterCount");

const loremIpsum =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Vestibulum sapien. Proin quam. Etiam ultrices. Suspendisse in justo eu magna luctus suscipit. Sed lectus. Integer euismod lacus luctus magna.  Integer id quam. Morbi mi. Quisque nisl felis, venenatis tristique, dignissim in, ultrices sit amet, augue. Proin sodales libero eget ante.";

function generate() {
  const wordVal = wordAmount.value;
  const fontVal = fontSize.value;
  const words = loremIpsum.split(" ");
  const loopedWords = words.slice();

  while (loopedWords.length < wordVal) {
    loopedWords.push(...words);
  }

  let loremOuput = loopedWords.slice(0, wordVal).join(" ");

  if (!loremOuput.endsWith(".")) {
    loremOuput += ".";
  }

  const wordCount = document.getElementById("wordCount");
  const letterCount = document.getElementById("letterCount");

  wordCount.innerHTML = wordVal;
  letterCount.innerHTML = loremOuput.length;

  const output = document.getElementById("loremOutput");
  output.style.fontSize = fontVal + "px";
  output.value = loremOuput;
}

wordAmount.addEventListener("input", generate);
fontSize.addEventListener("input", generate);

originalButton.addEventListener("click", function () {
  wordAmount.value = 145;
  fontSize.value = 14;
  generate();
});

generate();
