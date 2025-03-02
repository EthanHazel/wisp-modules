console.log("- VALIDATING MODULE INFO FILES -");

const fs = require("fs");

const MODULES_DIR = "./modules";

// Get every dir in the modules dir

const modules = fs
  .readdirSync(MODULES_DIR)
  .filter((dir) => fs.statSync(`${MODULES_DIR}/${dir}`).isDirectory());

// Functions

function isTitleCase(str) {
  const exceptions = new Set([
    "a",
    "an",
    "and",
    "as",
    "at",
    "but",
    "by",
    "for",
    "in",
    "nor",
    "of",
    "on",
    "or",
    "the",
    "up",
  ]);
  const words = str.split(/\s+/);

  if (words.length === 0) return false;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (word === "") continue; // Skip empty strings from multiple spaces

    const lowerWord = word.toLowerCase();
    const isFirstOrLast = i === 0 || i === words.length - 1;

    if (isFirstOrLast) {
      // First/last word must be capitalized (first letter uppercase, rest lowercase)
      if (word !== word[0].toUpperCase() + word.slice(1).toLowerCase()) {
        return false;
      }
    } else {
      if (exceptions.has(lowerWord)) {
        // Exception words should be entirely lowercase
        if (word !== lowerWord) {
          console.warn(
            `\x1b[33m%s\x1b[0m`,
            `⚠️ WARNING: '${word}' is an exception word in title case and should be lowercase.`
          );
        }
      }
      // Non-exception words must be capitalized
      if (word !== word[0].toUpperCase() + word.slice(1).toLowerCase()) {
        return false;
      }
    }
  }

  return true;
}

(async () => {
  for (const module of modules) {
    console.log(`Testing module ${module}...`);

    // Test to see if slug is kebab case and uses valid characters

    if (!/^[a-z0-9-]+$/.test(module)) {
      console.error(
        "\x1b[31m%s\x1b[0m",
        `❌ ERROR(${module}): The slug must only contain lowercase letters, numbers, and hyphens.`
      );
      process.exit(1);
    }

    try {
      var MODULE = JSON.parse(
        fs.readFileSync(`${MODULES_DIR}/${module}/info.json`, "utf-8")
      );
    } catch (error) {
      console.log(
        "\x1b[31m%s\x1b[0m",
        `❌ ERROR(${module}): could not read info.json:`
      );
      console.log(error);
      process.exit(1);
    }

    // Test to see if any required variables are missing or are empty

    if (
      !MODULE.name ||
      !MODULE.description ||
      !MODULE.icon ||
      !MODULE.contributors
    ) {
      console.error(
        "\x1b[31m%s\x1b[0m",
        `❌ ERROR(${module}): The module info file must have a name, description, contributors, and icon.`
      );
      process.exit(1);
    } else {
      console.log(`- Passed required variable test`);
    }

    // Test to see if variables are given the correct data type

    const invalidFields = [];
    if (typeof MODULE.name !== "string") invalidFields.push("name");
    if (typeof MODULE.description !== "string")
      invalidFields.push("description");
    if (typeof MODULE.icon !== "string") invalidFields.push("icon");
    if (!Array.isArray(MODULE.contributors)) invalidFields.push("contributors");
    if (!Array.isArray(MODULE.keywords)) invalidFields.push("keywords");

    if (invalidFields.length > 0) {
      console.error(
        "\x1b[31m%s\x1b[0m",
        `❌ ERROR(${module}): The following fields are invalid: ${invalidFields.join(
          ", "
        )}.`
      );
      process.exit(1);
    }

    // Test to see if there's any duplicate contributors in the contributors array

    const contributorCounts = MODULE.contributors.reduce((acc, contributor) => {
      acc[contributor] = (acc[contributor] || 0) + 1;
      return acc;
    }, {});

    const duplicates = Object.keys(contributorCounts).filter(
      (contributor) => contributorCounts[contributor] > 1
    );

    if (duplicates.length > 0) {
      console.error(
        "\x1b[31m%s\x1b[0m",
        `❌ ERROR(${module}): There must be no duplicate contributors in the contributors array. Duplicates: ${duplicates.join(
          ", "
        )}.`
      );
      process.exit(1);
    }

    console.log(`- Passed duplicate contributor test`);

    // Test to see if contributors are real GitHub users

    for (const contributor of MODULE.contributors) {
      try {
        const response = await fetch(
          `https://api.github.com/users/${contributor}`
        );

        if (response.status == 404) {
          console.error(
            "\x1b[31m%s\x1b[0m",
            `❌ ERROR(${module}): The contributor '${contributor}' does not exist. Please make sure you are using a valid GitHub username and not the display name.`
          );
          process.exit(1);
        }
      } catch (error) {
        console.log(
          "\x1b[31m%s\x1b[0m",
          `❌ ERROR(${module}): Could not load module contributors:`
        );
        console.log(error);
        process.exit(1);
      }
    }

    console.log(`- Passed valid contributor test`);

    // Test to see if the icon is a valid Lucide icon

    try {
      const MODULE_ICON = MODULE.icon
        .replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`)
        .replace(/^-/, "");

      const ICON_URL = `https://unpkg.com/lucide-static@latest/icons/${MODULE_ICON}.svg`;

      const response = await fetch(ICON_URL);

      if (response.status == 404) {
        console.error(
          "\x1b[31m%s\x1b[0m",
          `❌ ERROR(${module}): The icon '${MODULE_ICON}' not a valid Lucide icon.`
        );
        process.exit(1);
      }
      console.log(`- Passed lucide icon test`);
    } catch (error) {
      console.log(
        "\x1b[31m%s\x1b[0m",
        `❌ ERROR(${module}): Could not load module icon:`
      );
      console.log(error);
      process.exit(1);
    }

    // Test to see if the description is less than 200 characters (only give a ⚠️ WARNING if it isn't)

    if (MODULE.description.length > 200) {
      console.warn(
        `\x1b[33m%s\x1b[0m`,
        `⚠️ WARNING(${module}): The description is longer than 200 characters, please consider making it shorter.`
      );
    }

    // Test to see if the description ends with a period (only give a ⚠️ WARNING if it doesn't)

    if (!MODULE.description.endsWith(".")) {
      console.warn(
        `\x1b[33m%s\x1b[0m`,
        `⚠️ WARNING(${module}): The description should end with a period.`
      );
    }

    // Test to see if the name is less than 35 characters

    if (MODULE.name.length > 35) {
      console.error(
        "\x1b[31m%s\x1b[0m",
        `❌ ERROR(${module}): The name is longer than 35 characters.`
      );
      process.exit(1);
    }

    // Test to see if there's any duplicate keywords in the keywords array (including words that are in the title and description) (only give a ⚠️ WARNING if there are duplicates)

    const keywordLocations = MODULE.keywords.reduce((acc, keyword) => {
      acc[keyword] = acc[keyword] || { keywords: 0, name: 0, description: 0 };
      acc[keyword].keywords += 1;
      return acc;
    }, {});

    MODULE.name.split(" ").forEach((word) => {
      if (keywordLocations[word]) {
        keywordLocations[word].name += 1;
      }
    });

    MODULE.description.split(" ").forEach((word) => {
      if (keywordLocations[word]) {
        keywordLocations[word].description += 1;
      }
    });

    const duplicateKeywords = Object.entries(keywordLocations)
      .filter(
        ([, locations]) =>
          locations.keywords > 1 ||
          locations.name > 0 ||
          locations.description > 0
      )
      .map(([keyword, locations]) => {
        const places = [];
        if (locations.keywords > 1) places.push("keywords");
        if (locations.name > 0) places.push("name");
        if (locations.description > 0) places.push("description");
        return `${keyword}: in ${places.join(" & ")}`;
      });

    if (duplicateKeywords.length > 0) {
      console.warn(
        `\x1b[33m%s\x1b[0m`,
        `⚠️ WARNING(${module}): There are keywords that already exist in the title or description.\nDuplicates: ${duplicateKeywords.join(
          ", "
        )}.`
      );
    }

    // Test to see if there's any other variables in the info file that aren't in the list of allowed variables (only give a ⚠️ WARNING if there are other variables)

    const allowedVariables = [
      "name",
      "description",
      "icon",
      "contributors",
      "keywords",
      "attributions",
      "unlisted",
    ];

    const otherVariables = Object.keys(MODULE).filter(
      (variable) => !allowedVariables.includes(variable)
    );

    if (otherVariables.length > 0) {
      console.warn(
        `\x1b[33m%s\x1b[0m`,
        `⚠️ WARNING(${module}): There must be no other variables in the info file. Variables: ${otherVariables.join(
          ", "
        )}.`
      );
    }

    // Test to see if the title is not Title Case (only give a ⚠️ WARNING if it isn't)

    if (!isTitleCase(MODULE.name)) {
      console.warn(
        `\x1b[33m%s\x1b[0m`,
        `⚠️ WARNING(${module}): The title should be in Title Case.`
      );
    }

    console.log(`\x1b[32m✓ Passed all tests for module ${module}\x1b[0m\n`);
  }

  console.log("\x1b[32m✓ All modules passed all required tests!\x1b[0m\n");
  process.exit(0);
})();
