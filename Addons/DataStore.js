"use strict";

class DataStore {

  constructor(addons) {

    this.onPaint     = this.onPaint.bind(this);
    this.onStopPaint = this.onStopPaint.bind(this);
    this.onLineDrawn = this.onLineDrawn.bind(this);

    this._lines        = [];
    this._stashedLines = [];
    this._currentLine  = [];

    this.addons = addons;
    this.sketch = this.addons.sketch;

    this.sketch.on(this.sketch.NOTIFY_START_EVENT, this.onPaint);
    this.sketch.on(this.sketch.NOTIFY_PAINT_EVENT, this.onPaint);
    this.sketch.on(this.sketch.NOTIFY_STOP_EVENT, this.onStopPaint);
    this.sketch.on(this.sketch.NOTIFY_LINE_DRAWN, this.onLineDrawn);
  }

  onPaint(data) {
    this._currentLine.push(data[0]);
    return this;
  }

  onStopPaint() {
    this._lines.push({
      points  : this._currentLine,
      options : this.sketch.getDrawingOptions()
    });

    this._currentLine = [];
    this._stashedLines = [];

    return this;
  }

  getVisibleLines() {
    return this._lines;
  }

  onLineDrawn(data) {
    this._lines.push({
      points  : data[0],
      options : data[1]
    });

    return this;
  }

  pushLine(line) {
    this._lines.push(line);
    return this;
  }

  undo() {
    if (this._lines.length <= 0)
      return this;

    this._stashedLines.push(this._lines.pop());

    return this;
  }

  redo() {
    if (this._stashedLines.length <= 0)
      return [];

    var redoLine = this._stashedLines.pop();
    this._lines.push(redoLine);

    return redoLine;
  }

  reset() {
    this._lines = [];
    this._stashedLines = [];

    return this;
  }

}

module.exports = DataStore;
