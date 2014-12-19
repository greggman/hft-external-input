/*
 * Copyright 2014, Gregg Tavares.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Gregg Tavares. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
"use strict";

var hftConfig       = require('./lib/hft-config');
var path            = require('path');
var requirejs       = require('requirejs');
var WebSocketClient = hftConfig.hftRequire('lib/websocketclient');

requirejs.config({
  nodeRequire: require,
  paths: {
    hft: path.join(hftConfig.getHFTInstallDir(), 'public/hft/0.x.x/scripts'),
  },
});

var ExternalGameClient = function(options) {
  options = options || {};
  var GameClient = requirejs('hft/gameclient');
  var wsclient = options.socket || new WebSocketClient({url: "ws://localhost:18679"});
  var client = new GameClient({
    gameId: "jumpjump",
    socket: wsclient,
    quiet: true,
  });

  var noop = function(data) {
  };

  var handleDisconnect = function() {
    console.log("websocket disconnected");
    process.exit(1);
  };

  var handleError = function(data) {
    console.error("websocket error: " + data);
    process.exit(1);
  };

  var handleHFTRedirect = function(data) {
    console.error("jumpjump is not running");
    process.exit(1);
  };

  var noop = function() { };
  client.addEventListener('connect', noop);
  client.addEventListener('disconnect', handleDisconnect);
  client.addEventListener('error', handleError);
  client.addEventListener('_hft_redirect_', handleHFTRedirect);
  client.addEventListener('setColor', noop);

  var randInt = function(range) {
    return Math.floor(Math.random() * range);
  };

  // Send Random Commands
  var sendRandomCommand = function() {
    if (Math.random() > 0.5) {
      client.sendCmd('move', {
        dir: randInt(3) - 1,  // -1 for left, 0 for not pressed, 1 for right
      });
    } else {
      client.sendCmd('jump', {
        jump: randInt(2) == 1, // true if jump is pressed, false if released
      });
    }
  };

  setInterval(sendRandomCommand, 500);
};

module.exports = ExternalGameClient;
