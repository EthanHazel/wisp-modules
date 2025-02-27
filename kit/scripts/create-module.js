const fs = require("fs");
const prompt = require("prompt-sync")();

// Helper function to log errors in red
function logError(message) {
  console.log("\x1b[31m%s\x1b[0m", message); // \x1b[31m is the ANSI escape code for red
}

// Ask user for module slug
let slug;
let isValid = false;
do {
  slug = prompt("Enter the module slug \x1b[90m(a-z, 0-9, -):\x1b[0m ");
  if (!slug) {
    logError("You must enter a valid slug. Please try again.");
  } else if (!/^[a-z0-9-]+$/.test(slug)) {
    logError(
      "The slug must only contain lowercase letters, numbers, and hyphens."
    );
  } else if (fs.existsSync(`./modules/${slug}`)) {
    logError("The specified module slug already exists. Please try again.");
  } else {
    isValid = true;
  }
} while (!isValid);

const moduleData = {
  name: "",
  description: "Placeholder description.",
  icon: "FlaskConical",
  contributors: [],
  keywords: [],
  attributions: null,
};

// Ask user for module contributors
let contributors = [];
let isValidContributors = false;
do {
  const input = prompt(
    "Enter the module contributors github usernames \x1b[90m(separated by commas):\x1b[0m "
  );
  if (!input) {
    logError("You must enter at least one contributor. Please try again.");
  } else {
    const contributorsArray = input.split(",").map((c) => c.trim());
    if (contributorsArray.some((c) => c.includes(" "))) {
      logError(
        "The contributors must not have spaces in their names. Please try again."
      );
    } else {
      contributors = contributorsArray;
      isValidContributors = true;
    }
  }
} while (!isValidContributors);
moduleData.contributors = contributors;

// Ask user for module name
const defaultName = slug
  .replace(/-/g, " ")
  .replace(/\b[a-z]/g, (m) => m.toUpperCase());

const name = prompt(`Enter the module name \x1b[90m(${defaultName}):\x1b[0m `);

moduleData.name = name || defaultName;

// Ask for module keywords
const keywords = prompt(
  "Enter the module keywords seperated by commas \x1b[90m(None):\x1b[0m "
);
if (keywords) {
  moduleData.keywords = keywords
    .split(",")
    .map((k) => k.trim())
    .filter((k) => k);
} else {
  moduleData.keywords = [];
}

// Ask user for module description
const description = prompt(
  "Enter the module description \x1b[90m(Placeholder description):\x1b[0m "
);
if (description) {
  moduleData.description = description;
}

// Ask user for module attributions
const attributions = prompt(
  "Enter the module attributions \x1b[90m(None):\x1b[0m "
);
if (attributions) {
  moduleData.attributions = attributions;
}

// Create module directory
fs.mkdirSync(`./modules/${slug}`);

// Write module data to file
fs.writeFileSync(`./modules/${slug}/info.json`, JSON.stringify(moduleData));

// Copy the template files to the module directory
fs.copyFileSync("./kit/template/index.html", `./modules/${slug}/index.html`);
fs.copyFileSync("./kit/template/script.js", `./modules/${slug}/script.js`);

// Log success message
console.log(`\n\x1b[32mModule created successfully!\x1b[0m\n`);
console.log("The default icon for this module is: \x1b[34mFlaskConical\x1b[0m");
console.log(
  "You can change the icon in the module info file located at \x1b[34mmodules/" +
    slug +
    "/info.json\x1b[0m"
);
console.log(
  "To browse the icons that are available, visit: \x1b[34mhttps://lucide.dev/\x1b[0m\n"
);

console.log(
  "run \x1b[32mnpm run kit\x1b[0m to start the module development server!\n"
);
