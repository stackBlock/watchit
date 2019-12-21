#!/usr/bin/env node

const deBounce = require("./debounce.js");
// const deBounce = require("lodash.debounce");
const chokidar = require("chokidar");
const program = require("caporal");
const fs = require("fs");
const fsPromises = fs.promises;
const { spawn } = require("child_process");
const chalk = require("chalk");
const log = console.log;

program
  .version("1.0.0")
  .argument("[filename]", "Name of a file to execute")
  .action(async ({ filename }) => {
    const name = filename || "index.js";
    try {
      await fsPromises.access(name);
    } catch (err) {
      throw new Error(`Could not find the file ${name}`);
    }

    let proc;
    const start = deBounce(() => {
      if (proc) {
        log(
          chalk.red(">>>> ") +
            chalk.yellow("* CHANGE * ") +
            chalk.blue("Starting Process Again...")
        );
        proc.kill();
      } else {
        log(chalk.red(">>>> ") + chalk.blue("Starting Process..."));
      }
      proc = spawn("node", [name], { stdio: "inherit" });
    }, 100);

    chokidar
      .watch(".")
      .on("add", start)
      .on("change", start) // () => log(chalk.yellow("File changed")))
      .on(
        "unlink",
        (start,
        () => {
          log(
            chalk.red(">>>> ") +
              chalk.yellow("* CHANGE * ") +
              chalk.red("FILE REMOVED OR UNLINKED!!")
          );
        })
      ); // () => log(chalk.red("File unlinked")));
  });

// deBouce function in at deBounce.js AND lodash.debounce is installed for use
// currently using the deBounce.js function
program.parse(process.argv);
