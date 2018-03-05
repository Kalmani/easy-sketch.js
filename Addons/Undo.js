"use strict";

class Undo {

  constructor(main) {
    this.sketch    = main.sketch;
    this.DataStore = main.DataStore;
  }

  linkMethod() {
    this.sketch.undo = () => {
      this.sketch.clear();

      // Moves the last line in the redo queue
      this.DataStore.undo();

      // Storing the drawing options so we can restore them after the redraw
      var options = this.sketch.getDrawingOptions();

      // Redrawing the lines
      var lines = this.DataStore.getVisibleLines();
      for(var idx in lines) {
        if(lines.hasOwnProperty(idx)) {
          this.sketch.setOptions(lines[idx].options);
          this.sketch.drawLine(lines[idx].points, true);
        }
      }

      this.sketch.setOptions(options);
    };

  }

}

module.exports = Undo;
