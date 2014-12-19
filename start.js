#!/usr/bin/env node
;(function () { // wrapper in case we're in module_context mode

"use strict";

process.title = "hft-external-input";

var path = require('path');
var fs = require('fs');
var args = require('minimist')(process.argv.slice(2));
var hftConfig = require('./lib/hft-config');

hftConfig.setup({
  configPath: args.config,
  hftDir: args["hft-dir"],
});
if (!hftConfig.check()) {
  console.error("ERROR: happyFunTimes does not appear to be installed.")
  return;
}

var ExternalGameClient = require('./controller');

// spawn 3 players
var players = [];
var numPlayers = 3;
for (var ii = 0; ii < numPlayers; ++ii) {
  players.push(new ExternalGameClient());
}

}());

