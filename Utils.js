"use strict";

const Utils = {

  getScalePropertyName (object) {
    var property = "";
    var canvasStyle = object[0].style;

    // Looking for the non-prefixed property first since it's easier
    if ("transform" in canvasStyle) {
      property = "transform";
    } else {
      // Determining the property to use
      var prefixes = ["-moz", "-webkit", "-o", "-ms"];
      var propertyName = "";
      for (var i = 0; i < prefixes.length; i++) {
        propertyName = prefixes[i] + "-transform";
        if (propertyName in canvasStyle) {
          property = propertyName;
          break;
        }
      }
    }
    return property;
  },

  getScale (object) {
    var property = this.getScalePropertyName(object);
    var scale    = {
      x : 1,
      y : 1
    };

    if (property !== null) {
      var matrix = String(object.css(property));
      if (matrix != "none") {
        var regex = new RegExp("([0-9.-]+)", "g");
        var matches = matrix.match(regex);
        scale.x = parseFloat(matches[0]);
        scale.y = parseFloat(matches[3]);
      }
    }

    return scale;
  },

  extend (parent, child) {
    // Inheriting the methods
    for (var method in parent.prototype) {
      if (parent.prototype.hasOwnProperty(method) && typeof parent.prototype[method] === "function") {
        // We must not overwrite the methods in the child if they already exist
        if(!child.prototype.hasOwnProperty(method)) {
          child.prototype[method] = parent.prototype[method];
        }
      }
    }

    // Inheriting the properties
    for (var property in parent) {
      if (parent.hasOwnProperty(property) && typeof parent.prototype[method] !== "function") {
        child[property] = parent[property];
      }
    }
  }

};

module.exports = Utils;
