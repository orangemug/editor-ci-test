var config      = require("../config/specs");
var helper      = require("./helper");
var fetch = require('node-fetch');


describe('maputnik', function() {

  before(function(done) {
    require("./util/webdriverio-ext");
    console.log(">>>>>>>>>> STARTING GEOSERVER");
    helper.startGeoserver(done);
  });

  after(function(done) {
    console.log(">>>>>>>>>> STOPPING GEOSERVER");
    helper.stopGeoserver(done);
  });

  beforeEach(function() {
    // const res = await fetch(config.baseUrl);
    // console.log(">>>>>>>>>>>>>> FETCHING", await res.text());
    browser.url(config.baseUrl+"?debug&style="+helper.getStyleUrl([
      "geojson:example",
      "raster:raster"
    ]));
    browser.acceptAlert();
    browser.execute(function() {
      localStorage.setItem("survey", true);
    });
    const elem = $(".maputnik-toolbar-link");
    elem.waitForExist();
    browser.flushReactUpdates();
  });

  // -------- setup --------
  require("./util/coverage");
  // -----------------------

  // // ---- All the tests ----
  require("./history");
  require("./layers");
  require("./map");
  require("./modals");
  require("./screenshots");
  // // ------------------------

});

