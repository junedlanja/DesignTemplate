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

        addDesign: function (options, callback) {
            var self = this;
            fabric.loadSVGFromURL(options.url, function (objects) {
                objects.filter(function (obj) {
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
                            width: obj.width,
                            height: obj.height,
                            scaleX: obj.scaleX,
                            scaleY: obj.scaleY,
                            fill: obj.fill,
                            stroke: obj.stroke
                        });
                    }
                });
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
                        texts: self.designTexts,
                        textObjectInfo: self.textObjectInfo
                    });
                }, function () {
                    alert('Unable to load fonts');
                });
            });
        },

        changeText: function (id, text) {
            var group = this.canvas.getObjects()[0];
            // group.getObjects().filter(function (obj) {
            //     if (obj.type == "text" && obj.id == id) {
            //         obj.text = text;
            //     }
            // });
            this.textObjectInfo.filter(function (obj) {
                obj.canvasObj.id == id && (obj.canvasObj.text = text);
            });
            group.set('dirty', true);
            this.canvas.renderAll();
            this.resizeText();
        },

        changeFontFamily: function (fontFamily) {
            var group = this.canvas.getObjects()[0];
            // group.getObjects().filter(function (obj) {
            //     if (obj.type == "text") {
            //         obj.fontFamily = fontFamily;
            //     }
            // });
            this.textObjectInfo.filter(function (obj) {
                obj.canvasObj.fontFamily = fontFamily;
            });
            group.set('dirty', true);
            this.canvas.renderAll();
            this.resizeText();
        },

        changeColor: function (id, color) {
            var group = this.canvas.getObjects()[0];
            this.textObjectInfo[id].canvasObj.fill = color;
            group.set('dirty', true);
            this.canvas.renderAll();
        },

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
        }
    }
})();