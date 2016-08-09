"use strict";

var Class = require('uclass');

var Redo = new Class({

  initialize : function(main) {
    this.sketch = main.sketch;
    this.DataStore = main.DataStore;
  },

  linkMethod : function() {
    var self = this;
    this.sketch.redo = function() {
      // Moves the last line in the "undo" queue
      var line = self.DataStore.redo();

      if (line.length == 0)
        return;

      // Storing the drawing options so we can restore them after the redraw
      var options = self.sketch.getDrawingOptions();

      // Redrawing the lines
      self.sketch.setOptions(line.options);
      self.sketch.drawLine(line.points, true);

      // Restore
      self.sketch.setOptions(options);
    };

  }

});

module.exports = Redo;