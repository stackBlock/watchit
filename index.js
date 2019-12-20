#!/usr/bin/env node

const deBounce = require('./debounce.js')
// const deBounce = require("lodash.debounce");
const chokidar = require("chokidar");
const chalk = require("chalk");
const log = console.log;


const start = deBounce(() => {
  log(chalk.blue("Starting users program"));
}, 100);

chokidar
  .watch(".")
  .on("add", start)
  .on("change", () => log(chalk.yellow("File changed")))
  .on("unlink", () => log(chalk.red("File unlinked")));




// deBouce function in at deBounce.js AND lodash.debounce is installed for use
// currently using the deBounce.js function