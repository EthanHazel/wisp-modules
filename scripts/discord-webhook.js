// scripts/discord-webhook.js
const core = require("@actions/core");
const github = require("@actions/github");
const fs = require("fs");

async function run() {
  try {
    const commit = await github.rest.repos.getCommit({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      ref: github.context.sha,
    });

    const modifiedFiles = commit.data.files
      .map((file) => {
        const symbols = {
          modified: "\u001b[2;34m- ",
          added: "\u001b[2;36m+ ",
          removed: "\u001b[2;35m⤬ ",
        };
        return symbols[file.status] + file.filename + "\u001b[0m";
      })
      .filter(Boolean);

    console.log(modifiedFiles.join("\n"));

    // Create the raw-data JSON object
    const rawData = {
      embeds: [
        {
          title: `\`${github.context.repo.owner}/${github.context.repo.repo}\``,
          color: 16777215,
          author: {
            name: `Commit from ${github.context.payload.head_commit.author.username}`,
            url: `https://github.com/${github.context.payload.head_commit.author.username}/`,
            icon_url: `https://avatars.githubusercontent.com/${github.context.payload.head_commit.author.username}`,
          },
          description:
            `[\`${github.context.payload.head_commit.message}\`](https://github.com/${github.context.repo.owner}/${github.context.repo.repo}/commit/${github.context.sha})\n` +
            "```ansi\n" +
            modifiedFiles.join("\n") +
            "```",
        },
      ],
    };

    // Write the raw-data JSON to a file
    const path = "./raw-data.json";
    fs.writeFileSync(path, JSON.stringify(rawData, null, 2));
    core.setOutput("raw-data-path", path);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
