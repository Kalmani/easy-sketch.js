easy-sketch.js
===================

Go check out the [main repository !](https://github.com/brian978/easy-sketch.js), not maintained but, still...

easy-sketch.js allows you to draw on canvas without having to dig into the HTML 5 API. It's very easy to use,
very flexible, very small (13KB compressed) and can be extended with ease if needed.

A demo can be found in the repository.


Dependencies
-------------------
- HTML 5
- jQuery


Usage
-------------------

To create the class all you need to do is

    var EasySketch = require('./your/module/path/EasySketch');
    var sketcher   = new EasySketch("#drawing-canvas", options);


- the first parameter can be either a selector (class selector is not supported), element ID, jQuery object, JS object;
- the second parameter is optional and may be an object containing 2 properties: color, width; these parameters can also be set using the setOptions() method;


### Eraser


By default, after you create the sketch object you are able to draw on the canvas. To enable the eraser (or disable if for that matter) you can call the enableEraser() method with either the value true or false to enable or disable the eraser.

    sketcher.enableEraser(true); // Eraser enabled / Pencil disabled
    sketcher.enableEraser(false); // Pencil enabled / Eraser disabled


### Pencil / eraser options

For adjusting the width, color (the color can only be changed for the pencil) and opacity ( *alpha* option )
you can use the setOptions() method like so:

    sketcher.setOptions({width: 10, color: "#000", alpha: 0.5});

Or if you need to set them separately:

    sketcher.setOption("width", 10});
    sketcher.setOption("color", "#000"});
    sketcher.setOption("alpha", 0.5});

The *alpha* option can take any value from 0 to 1.

To get an option you can call the getOption() method with the option name you desire. By default it will return null if it does not
find it, but that can be changed using the second parameter:

    sketcher.getOption("color");

or with the default changed

    sketcher.getOption("some option", "value to return if option is not found");


### Drawing without user input

To draw a line all you need to do is call the drawLine() method like so:

    sketcher.drawLine([
        {
            x: 20,
            y: 10
        },
        {
            x: 40,
            y: 100
        },
        {
            x: 60,
            y: 10
        }
    ]);


### Events triggered by the class

When the painting starts the *EasySketch.Sketch.NOTIFY_START_EVENT* event is triggered. The event is fired 1 parameter: an object containing the mouse position (x & y)

After the painting has started and the user moves the pointer, the *EasySketch.Sketch.NOTIFY_PAINT_EVENT* event is triggered. The event is fired 1 parameter: an object containing the mouse position (x & y)

When the user releases the mouse button the *EasySketch.Sketch.NOTIFY_STOP_EVENT* event is triggered. The event has no parameters.

### Setting a custom object to bind to

In case you need a custom object to bind the events on, you can pass it to the constructor in the options:

    var sketcher = new EasySketch.Sketch("#someId", {bindingObject: $("#customElement")});

**This option CANNOT be set after the creation of the object because the method that attaches the listeners is called in the constructor.**

### Manual binding

Let's say that for some reason you want to attach the listeners on the object later and not when the object is created. You can
switch to manual binding by setting the option **autoBind** to false when creating the object:

    var sketcher = new EasySketch.Sketch("#someId", {autoBind: false});

### Detaching the listeners

By default, when the object is created, a series of listeners are attached on the canvas or the object that was provided for
binding. You can remove those listeners by calling the detachListeners() method:

    sketcher.detachListeners();

### Clearing the canvas

To clear the canvas all you need to do is call the *clear()* method:

    sketcher.clear();


## Addons

The addon system allows you to "attach" different features to the EasySketch library. To create an addon you must
"extend" the *EasySketch.Addon.AbstractAddon* class and then attach the addon using the registerAddon() method in the
`Sketch` object

### Undo/Redo

The undo and redo can be used separately (although the redo doesn't make any sense without the undo) and they depend on
the `EasySketch/Addon/UndoRedoDataStore` class. The `EasySketch/Addon/UndoRedoDataStore` class basically stores the
points that were drawn on the canvas and moves them around in different stacks when the undo/redo feature is used.

To create the objects you need to do the following (after you import the classes using the RequireJS syntax of course):

    var undo = require('./your/module/path/Addons/Undo');
    var redo = require('./your/module/path/Addons/Redo');

    sketcher.registerAddon(undo);
    sketcher.registerAddon(redo);
