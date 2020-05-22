var webpack          = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig    = require("./webpack.config");
var testConfig       = require("../test/config/specs");
var artifacts        = require("../test/artifacts");
var isDocker         = require("is-docker");


var server;
var SCREENSHOT_PATH = artifacts.pathSync("screenshots");

exports.config = {
  path: '/wd/hub',
  specs: [
    './test/functional/index.js'
  ],
  maxInstances: 10,
  capabilities: [{
    maxInstances: 5,
    browserName: 'chrome',
  }],
  logLevel: 'info',
  bail: 0,
  screenshotPath: SCREENSHOT_PATH,
  hostname: process.env.DOCKER_HOST || "0.0.0.0",
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
  },
  onPrepare: function (config, capabilities) {
    return new Promise(function(resolve, reject) {
      var compiler = webpack(webpackConfig);
      const serverHost = "0.0.0.0";

      server = new WebpackDevServer(compiler, {
        host: serverHost,
        stats: {
          colors: true
        }
      });

      server.listen(testConfig.port, serverHost, function(err) {
        if(err) {
          reject(err);
        }
        else {
          resolve();
        }
      });
    })
  },
  onComplete: function(exitCode) {
    console.log("start onComplete", exitCode, server)
    return new Promise(function(resolve, reject) {
      server.close(function (err) {
        console.log(">>>>>> onComplete", arguments);
        if (err) {
          reject(err)
        }
        else {
          resolve();
        }
      })
    });
  }
}
