"use strict";

class Redo {

  constructor(main) {
    this.sketch    = main.sketch;
    this.DataStore = main.DataStore;
  }

  linkMethod() {
    this.sketch.redo = () => {
      // Moves the last line in the "undo" queue
      var line = this.DataStore.redo();

      if(line.length == 0)
        return;

      // Storing the drawing options so we can restore them after the redraw
      var options = this.sketch.getDrawingOptions();

      // Redrawing the lines
      this.sketch.setOptions(line.options);
      this.sketch.drawLine(line.points, true);

      // Restore
      this.sketch.setOptions(options);
    };
  }

}

module.exports = Redo;
