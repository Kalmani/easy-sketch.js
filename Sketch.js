"use strict";

const Events = require('events').EventEmitter;
const Addons = require('./Addons');

class Sketch extends Events {

  constructor() {
    super();

    Object.assign(
      this,
      require('./Utils')
    );

    this._autoAdjustOverlay = this._autoAdjustOverlay.bind(this);
  }

  _initAddons() {
    this.addons = new Addons(this);
  }

  selectContext() {
    if (this.options.doubleBuffering === true && this.eraser === false)
      return this.overlayContext;

    return this.context;
  }

  selectCanvas() {
    if (this.options.doubleBuffering === true)
      return this.overlay;

    return this.canvas;
  }

  getOption(name, defaultValue) {
    defaultValue = defaultValue || null;

    if (this.options.hasOwnProperty(name))
      return this.options[name];

    return defaultValue;
  }

  getDrawingOptions() {
    return {
      color : this.options.color,
      width : this.options.width,
      alpha : this.options.alpha
    };
  }

  _createCanvas(element) {
    var canvas;
    var elementType = typeof element;

    switch (elementType) {
      case "string":
        if (element.indexOf('#') === 0) {
          canvas = $(element);
        } else if (element.indexOf('.') === -1) {
          canvas = $("#" + element);
        }
        break;

      case "object":
        if (element instanceof jQuery) {
          canvas = element;
        } else {
          canvas = $(element);
        }
        break;
    }

    this.canvas = canvas;
  }

  attachListeners(force) {
    if (this.binded === true && !force)
      return this;

    this.binded = true;

    // Selecting the object to bind on
    var bindingObject;
    if (this.getOption("bindingObject") !== null) {
      bindingObject = this.options["bindingObject"];
    } else {
      bindingObject = this.canvas;
    }

    if (force === true) {
      bindingObject.off('mousedown touchstart');
      bindingObject.off('mousemove touchmove');
      bindingObject.off('mouseup mouseleave mouseout touchend touchcancel');
    }

    // Canvas listeners
    switch (this.options.mode) {
      case 'pencil' :
        bindingObject.on('mousedown touchstart', this.listeners.start);
        bindingObject.on('mousemove touchmove', this.listeners.draw);
        bindingObject.on('mouseup mouseleave mouseout touchend touchcancel', this.listeners.stop);
        break;
      case 'line' :
        bindingObject.on('mousedown touchstart', this.listeners.startLine);
        bindingObject.on('mousemove touchmove', this.listeners.makeLine);
        bindingObject.on('mouseup mouseleave mouseout touchend touchcancel',this.listeners.stopLine);
        break;
    }
    return this;
  }

  detachListeners() {
    if (this.binded === false)
      return this;

    this.binded = false;

    // Selecting the object to bind on
    var bindingObject;
    if (this.getOption("bindingObject") !== null) {
      bindingObject = this.options["bindingObject"];
    } else {
      bindingObject = this.canvas;
    }

    // Canvas listeners
    bindingObject.off('mousedown touchstart', this.listeners.start);
    bindingObject.off('mousemove touchmove', this.listeners.draw);
    bindingObject.off('mouseup mouseleave mouseout touchend touchcancel', this.listeners.stop);

    return this;
  }

  getPointerPosition(e) {
    var $this = this;
    var scale = this.getScale(this.selectCanvas());

    if (e.originalEvent && e.originalEvent.changedTouches && e.originalEvent.changedTouches.length > 0) {
      e.pageX = e.originalEvent.changedTouches[0].pageX;
      e.pageY = e.originalEvent.changedTouches[0].pageY;
    }

    return {
      x : Math.ceil((e.pageX - $this.canvas.offset().left) / scale.x),
      y : Math.ceil((e.pageY - $this.canvas.offset().top) / scale.y)
    };
  }

  enableEraser(value) {
    this.eraser = value;

    return this;
  }

  contextSetup(context) {
    context = context || this.selectContext();

    // Saving first to avoid changing other stuff
    context.save();

    // Applying our requirements
    context.strokeStyle = this.options.color;
    context.lineWidth = this.options.width;
    context.globalAlpha = this.options.alpha;
    context.lineCap = "round";
    context.lineJoin = "round";

    return this;
  }

  contextRestore(context) {
    context = context || this.selectContext();
    context.restore();

    return this;
  }

  startDrawing(e) {
    if (this.drawing === true || this.disabled === true)
      return this;

    // To be able to handle touch events
    e.preventDefault();

    // Getting the pointer position if it was not provided
    var mouse = this.getPointerPosition(e);

    this.drawing = true;
    this.lastMouse = mouse;

    // Setting up the context with our requirements
    this.contextSetup();

    // Buffering the mouse position
    if (this.options.doubleBuffering === true && this.eraser === false)
      this.points.push(mouse);

    this.emit(this.NOTIFY_START_EVENT, [mouse]);

    return this;
  }

  startDrawingLine(e) {
    // To be able to handle touch events
    e.preventDefault();

    // Getting the pointer position if it was not provided
    var mouse = this.getPointerPosition(e);
    this.startLinePoint = mouse;
    this.pattern = $('<div></div>').attr({
      id    : 'pattern',
      style : 'height:5px; background-color:' + this.options.color + '; top:' + mouse.y + 'px; left:' + mouse.x + 'px;'
    }).appendTo(this.canvas.parent());
  }

  makeDrawingLine(e) {
    // To be able to handle touch events
    e.preventDefault();

    if (this.startLinePoint) {
      // Getting the pointer position if it was not provided
      var mouse  = this.getPointerPosition(e);
      var params = this.getLengthAngle(this.startLinePoint.x, mouse.x, this.startLinePoint.y, mouse.y);

      $(this.pattern).css({
        'width'            : (params.length + 10) + 'px',
        'transform'        : 'rotate(' + params.angle + 'deg)',
        'transform-origin' : 'center left'
      });
    }
  }

  stopDrawingLine(e) {
    // To be able to handle touch events
    e.preventDefault();
    if(e.relatedTarget && $(e.relatedTarget).attr('id') == 'pattern')
      return;

    if (this.startLinePoint) {
      // Getting the pointer position if it was not provided
      var mouse = this.getPointerPosition(e);
      this.drawLine([
        {
          x : this.startLinePoint.x,
          y : this.startLinePoint.y
        },
        {
          x : mouse.x,
          y : mouse.y
        }
      ]);
    }
    $('#pattern').remove();
    this.startLinePoint = false;
  }

  getLengthAngle(x1, x2, y1, y2) {
    var xDiff = x2 - x1;
    var yDiff = y2 - y1;

    return {
      length : Math.ceil(Math.sqrt(xDiff * xDiff + yDiff * yDiff)),
      angle  : Math.round((Math.atan2(yDiff, xDiff) * 180) / Math.PI)
    };
  }

  makeDrawing(e) {
    if (this.drawing === false || this.disabled === true)
      return this;

    // To be able to handle touch events
    e.preventDefault();

    var mouse = this.getPointerPosition(e);

    this.drawPoints([this.lastMouse, mouse], this.selectContext());

    // The last position MUST be updated after drawing the line
    this.lastMouse = mouse;

    // Redrawing the line on the overlay
    if (this.options.doubleBuffering === true && this.eraser === false) {
      this.points.push(mouse);
      this.redrawBuffer();
    }

    this.emit(this.NOTIFY_PAINT_EVENT, [mouse]);

    return this;
  }

  stopDrawing() {
    if (this.drawing === false)
      return this;

    this.drawing = false;

    // Adding some CSS in the mix
    this.canvas.css('cursor', 'auto');

    // Restoring
    this.contextRestore();

    // Flushing the buffer
    if (this.options.doubleBuffering === true && this.eraser === false) {
      this.drawLine(this.points, true);
      this.points = [];
      this.clearOverlay();
    }

    // Triggering the stop event
    this.emit(this.NOTIFY_STOP_EVENT);

    return this;
  }

  redrawBuffer() {
    this.clearOverlay();
    this.drawPoints(this.points, this.overlayContext);

    return this;
  }

  drawPoints(points, context) {
    points = points.slice();
    var coordinates = points.shift();

    // Configuring the pen
    if (this.eraser) {
      // We do a save first to keep the previous globalCompositionOperation
      context.save();
      context.strokeStyle = "rgba(0,0,0,1)";
      context.globalAlpha = 1;
      context.globalCompositeOperation = "destination-out";
    }

    context.beginPath();
    context.moveTo(coordinates.x, coordinates.y);
    while (points.length > 0) {
      coordinates = points.shift();
      context.lineTo(coordinates.x, coordinates.y);
    }
    context.stroke();
    context.closePath();

    // Restoring the globalCompositeOperation
    if (this.eraser)
      context.restore();

    return this;
  }

  drawLine(pointsArray, skipEvent) {
    skipEvent = skipEvent || false;

    // Drawing a line MUST always be done on the master canvas
    var context = this.context;

    // Executing the drawing operations
    this.contextSetup(context);
    this.drawPoints(pointsArray, context);
    this.contextRestore(context);

    // This is used mostly by addons or components of addons
    if (!skipEvent)
      this.emit(this.NOTIFY_LINE_DRAWN, [pointsArray, this.getDrawingOptions()]);

    return this;
  }

  clear() {
    $('#pattern').remove();
    this.context.clearRect(0, 0, this.canvas[0].width, this.canvas[0].height);

    return this;
  }

  changeMode(mode) {
    this.options.mode = mode;
    this.attachListeners(true);
  }

  clearOverlay() {
    if (this.overlayContext instanceof CanvasRenderingContext2D)
      this.overlayContext.clearRect(0, 0, this.overlay[0].width, this.overlay[0].height);

    return this;
  }

  registerAddon(addon) {
    this.addons.register(addon);
  }

}

module.exports = Sketch;
