//Overright deafult control colors
fabric.Object.prototype.set({
    transparentCorners: false,
    borderColor: '#ff00ff',
    cornerColor: '#007bff'
});

//Design template module
var DesignTemplate = (function () {
    return {
        canvas: null,

        defaultHeight: 600,

        defaultWidth: 600,

        maxTextLength: 25,

        maxTextWidth: 0,

        maxTextHeight: 0,

        designTexts: [],

        textObjectInfo: [],

        designFontFamily: "Avenir",


        //get the max width & hight upto which object will scale
        getMaxDimension: function () {
            this.maxTextWidth = Math.max.apply(null, this.textObjectInfo.map(function (obj) {
                return obj.width;
            }));
            this.maxTextHeight = Math.max.apply(null, this.textObjectInfo.map(function (obj) {
                return obj.height;
            }));
        },

        //creates the canvas with specified height and width
        createCanvas: function (canvasId) {
            if (!canvasId || !document.getElementById(canvasId))
                throw new Error('Canvas element not found');
            this.canvas = new fabric.StaticCanvas(canvasId, {
                height: this.defaultHeight,
                width: this.defaultWidth,
                selection: false,
                renderOnAddRemove: false
            });
            return this.canvas;
        },

        //add template on the canvas
        addDesign: function (options, callback) {
            var self = this;
            fabric.loadSVGFromURL(options.url, function (objects) {
                objects.filter(function (obj) {
                    //collect the information of text objects
                    if (obj.type === "text") {
                        var index = self.designTexts.indexOf(obj.text);
                        if (index == -1) {
                            obj.id = self.designTexts.length + 1;
                            self.designFontFamily = obj.fontFamily;
                            self.designTexts.push(obj.text);
                        } else {
                            obj.id = index + 1;
                        }
                        self.textObjectInfo.push({
                            canvasObj: obj,
                            text: obj.text,
                            width: obj.width,
                            height: obj.height,
                            scaleX: obj.scaleX,
                            scaleY: obj.scaleY,
                            fill: obj.fill,
                            stroke: obj.stroke
                        });
                    }
                });

                //load the default font used in SVG
                loadFonts(self.designFontFamily, function () {
                    var group = fabric.util.groupSVGElements(objects, {
                        width: options.width,
                        height: options.height,
                        selectable: false
                    });
                    (options.height >= options.width) ? group.scaleToHeight(self.canvas.getHeight()): group.scaleToWidth(self.canvas.getWidth());
                    self.canvas.centerObject(group);
                    self.canvas.add(group);
                    self.canvas.renderAll();
                    self.getMaxDimension();
                    callback && callback({
                        fontFamily: self.designFontFamily,
                        designTexts: self.designTexts,
                        textObjectInfo: self.textObjectInfo
                    });
                }, function () {
                    alert('Unable to load fonts');
                });
            });
        },

        //change the text
        changeText: function (id, text) {
            var group = this.canvas.getObjects()[0];
            this.textObjectInfo.filter(function (obj) {
                obj.canvasObj.id == id && (obj.canvasObj.text = text);
            });
            group.set('dirty', true);
            this.canvas.renderAll();
            this.resizeText();
        },

        //change the font family
        changeFontFamily: function (fontFamily, callback) {
            var group = this.canvas.getObjects()[0];
            this.textObjectInfo.filter(function (obj) {
                //obj.canvasObj.text = obj.text;
                obj.canvasObj.fontFamily = fontFamily;
            });
            group.set('dirty', true);
            this.canvas.renderAll();
            //this.resetTextSize(callback);
            this.resizeText();
        },

        //change text color
        changeColor: function (id, color) {
            this.textObjectInfo[id].canvasObj.fill = color;
            var group = this.canvas.getObjects()[0];
            group.set('dirty', true);
            this.canvas.renderAll();
        },

        /* resize text to fit into the max height/width 
          (Max height/ width is qual to the text node with max height/ width 
            of SVG. So while designing SVG its advisable Put text node such that it will
            cover max design area.)
        */
        resizeText: function () {
            var self = this;
            var changed = true;
            this.textObjectInfo.filter(function (obj) {
                var width = obj.canvasObj.width;
                var ratio = self.maxTextWidth / width;
                if (width > self.maxTextWidth) {
                    changed = true;
                    obj.canvasObj.scaleX = ratio * obj.scaleX;
                    obj.canvasObj.scaleY = ratio * obj.scaleY;
                }
            });
            if (changed) {
                var group = self.canvas.getObjects()[0];
                group.set('dirty', true);
                self.canvas.renderAll();
            }
        },

        resetTextSize: function (callback) {
            var self = this;
            this.textObjectInfo.filter(function (obj) {
                obj.canvasObj.scaleX = obj.scaleX;
                obj.canvasObj.scaleY = obj.scaleY;
                var width = obj.canvasObj.width;
                if (width > self.maxTextWidth) {
                    obj.canvasObj.scaleX = self.maxTextWidth / width * obj.scaleX;
                }
            });
            var group = self.canvas.getObjects()[0];
            group.set('dirty', true);
            self.canvas.renderAll();
            callback && callback();
        },

        //export canvas as data URL 
        exportDesign: function () {
            if (!this.canvas)
                throw new Error('No canvas found');
            return this.canvas.toDataURL();
        }
    }
})();