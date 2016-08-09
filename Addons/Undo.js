"use strict";

var Class = require('uclass');

var Undo = new Class({

  initialize : function(main) {
    this.sketch = main.sketch;
    this.DataStore = main.DataStore;
  },

  linkMethod : function() {
    var self = this;
    this.sketch.undo = function() {
      self.sketch.clear();

      // Moves the last line in the redo queue
      self.DataStore.undo();

      // Storing the drawing options so we can restore them after the redraw
      var options = self.sketch.getDrawingOptions();

      // Redrawing the lines
      var lines = self.DataStore.getVisibleLines();
      for (var idx in lines) {
        if (lines.hasOwnProperty(idx)) {
          self.sketch.setOptions(lines[idx].options);
          self.sketch.drawLine(lines[idx].points, true);
        }
      }

      self.sketch.setOptions(options);
    };

  }

});

module.exports = Undo;