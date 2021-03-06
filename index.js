#!/usr/bin/env node

//dependency for file handling
var fs = require("fs");

//dependency to get the file extension
var path = require("path");

//dependency for taking inputs from CLI using flags
const args = require("yargs").argv;

//dependency to parse yaml to json
const yaml = require("js-yaml");

//dependency for replacing tokens in a file
const Jtr = require("json-token-replace");
const jtr = new Jtr();

//check for the inputfile present or not
if (args.inputfile !== undefined) {
  var filePath = args.inputfile;
  var fileContents = fs.readFileSync(filePath, "utf-8");
  var fileExtension = path.extname(filePath);
  if (fileExtension !== ".yaml" && fileExtension !== ".json") {
    console.error("Please provide a valid json or yaml file");
    return;
  }
} else {
  console.error("Please provide a valid file path");
  return;
}

//check whether tokensfile present or not
if (args.tokensfile !== undefined) {
  var tokensPath = args.tokensfile;
  var tokens = fs.readFileSync(tokensPath, "utf-8");
  var tokensExtension = path.extname(tokensPath);
  if (tokensExtension !== ".yaml" && tokensExtension !== ".json") {
    console.error("Please provide a valid json or yaml file");
    return;
  }
} else {
  console.error("Please provide a valid file containing token values");
  return;
}

//if yaml file then convert to json
if (fileExtension === ".yaml") {
  fileContents = yaml.load(fileContents);
} else {
  fileContents = JSON.parse(fileContents);
}

//if tokens file is a yaml file then convert to json
if (tokensExtension === ".yaml") {
  tokens = yaml.load(tokens);
} else {
  tokens = JSON.parse(tokens);
}

let output = jtr.replace(tokens, fileContents, "$(", ")");

if (fileExtension === ".yaml") {
  output = yaml.safeDump(output);
} else {
  output = JSON.stringify(output);
}
console.log(output);

fs.writeFileSync(filePath, output, "utf-8");
