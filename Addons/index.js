"use strict";

const DataStore = require('./DataStore');

class Addons {

  constructor(sketch) {
    this._list     = [];
    this.sketch    = sketch;
    this.DataStore = new DataStore(this);
  }

  register(Addon) {
    var addon = new Addon(this);
    addon.linkMethod();
  }

}

module.exports = Addons;
