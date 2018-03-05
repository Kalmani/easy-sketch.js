"use strict";

const deepMixIn  = require('mout/object/deepMixIn');

const Sketch     = require('./Sketch');

class EasySketch extends Sketch {

  constructor(element, options) {

    super();

    this.NOTIFY_START_EVENT = 'notify.start';
    this.NOTIFY_PAINT_EVENT = 'notify.paint';
    this.NOTIFY_STOP_EVENT  = 'notify.stop';
    this.NOTIFY_LINE_DRAWN  = 'notify.line.drawn';

    this.lastMouse      = {x : 0, y : 0};
    this.disabled       = false;
    this.binded         = false;
    this.drawing        = false;
    this.events         = {};
    this.eraser         = false;
    this.overlay        = null;
    this.overlayContext = null;
    this.points         = [];

    this.options        = {
      color         : "#000000",
      width         : 5,
      alpha         : 1,
      bindingObject : null,
      autoBind      : true,
      mode          : 'pencil'
    };

    this.addons  = null;
    this.canvas  = null;
    this.context = null;

    this.listeners = {
      start     : this.startDrawing.bind(this),
      draw      : this.makeDrawing.bind(this),
      stop      : this.stopDrawing.bind(this),
      startLine : this.startDrawingLine.bind(this),
      stopLine  : this.stopDrawingLine.bind(this),
      makeLine  : this.makeDrawingLine.bind(this)
    };

    deepMixIn(this.options, (options || {}));

    this._createCanvas(element);
    this.context = this.canvas.get(0).getContext("2d");

    if(this.options.autoBind === true)
      this.attachListeners();

    this._initAddons();

  }

}

module.exports = EasySketch;
