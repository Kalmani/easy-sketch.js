"use strict";

var Class = require('uclass');

var DataStore = new Class({

  Binds : [
    'onPaint',
    'onStopPaint',
    'onLineDrawn'
  ],

  _lines : [],
  _stashedLines : [],
  _currentLine : [],
  sketch : null,
  addons : null,

  initialize : function(addons) {

        
    this.addons = addons;
    this.sketch = this.addons.sketch;

    this.sketch.addEvent(this.sketch.NOTIFY_START_EVENT, this.onPaint);
    this.sketch.addEvent(this.sketch.NOTIFY_PAINT_EVENT, this.onPaint);
    this.sketch.addEvent(this.sketch.NOTIFY_STOP_EVENT, this.onStopPaint);
    this.sketch.addEvent(this.sketch.NOTIFY_LINE_DRAWN, this.onLineDrawn);
  },

  onPaint : function (data) {
    this._currentLine.push(data[0]);
    return this;
  },

  onStopPaint : function () {
    this._lines.push({
      points  : this._currentLine,
      options : this.sketch.getDrawingOptions()
    });

    this._currentLine = [];
    this._stashedLines = [];

    return this;
  },

  getVisibleLines : function () {
    return this._lines;
  },

  onLineDrawn : function (data) {
    this._lines.push({
      points  : data[0],
      options : data[1]
    });

    return this;
  },

  pushLine : function (line) {
    this._lines.push(line);
    return this;
  },

  undo : function () {
    if (this._lines.length <= 0)
      return this;

    this._stashedLines.push(this._lines.pop());

    return this;
  },

  redo : function () {
    if (this._stashedLines.length <= 0)
      return [];

    var redoLine = this._stashedLines.pop();
    this._lines.push(redoLine);

    return redoLine;
  },

  reset : function () {
    this._lines = [];
    this._stashedLines = [];

    return this;
  }
});

module.exports = DataStore;
