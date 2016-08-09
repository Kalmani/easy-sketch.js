"use strict";

/**
 * easy-sketch.js
 *
 * @link https://github.com/brian978/easy-sketch.js
 * @copyright Copyright (c) 2015
 * @license https://github.com/brian978/easy-sketch.js/blob/master/LICENSE New BSD License
**/

var Class = require('uclass');

/*var Event        = require('./Event');
var Util         = require('./Util');
var Addon        = require('./Addon');*/

var EasySketch = new Class({

  Implements : [
    require('uclass/options'),
    require('./Sketch')
  ],

  NOTIFY_START_EVENT : 'notify.start',
  NOTIFY_PAINT_EVENT : 'notify.paint',
  NOTIFY_STOP_EVENT  : 'notify.stop',
  NOTIFY_LINE_DRAWN  : 'notify.line.drawn',

  lastMouse : {x : 0, y : 0},
  disabled : false,
  binded : false,
  drawing : false,
  events : {},
  eraser : false,
  overlay : null,
  overlayContext : null,
  points : [],

  /* @type {{color: string, width: number, alpha: number, bindingObject: jQuery, autoBind: boolean}} */
  options : {
    color           : "#000000",
    width           : 5,
    alpha           : 1,
    bindingObject   : null,
    autoBind        : true,
    mode            : 'pencil'
  },

  addons : null,
  canvas : null,
  context : null,

  initialize : function(element, options) {

    this.listeners = {
      start: this.startDrawing.bind(this),
      draw: this.makeDrawing.bind(this),
      stop: this.stopDrawing.bind(this),
      startLine : this.startDrawingLine.bind(this),
      stopLine : this.stopDrawingLine.bind(this),
      makeLine : this.makeDrawingLine.bind(this)
    };

    // Setting the options
    if (options) {
        this.setOptions(options);
    }

    this._createCanvas(element);
    this.context = this.canvas.get(0).getContext("2d");

    if (this.options.autoBind === true)
      this.attachListeners();

    this._initAddons();

  }

});

module.exports = EasySketch;
