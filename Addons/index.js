"use strict";

var Class     = require('uclass');
var DataStore = require('./DataStore');

var Addons = new Class({

  _list     : [],
  sketch    : null,
  dataStore : null,

  initialize : function(sketch) {
    this.sketch = sketch;
    this.DataStore = new DataStore(this);
  },

  register : function(Addon) {
    var addon = new Addon(this);
    addon.linkMethod();
  }

});

module.exports = Addons;
