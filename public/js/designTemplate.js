//Overright deafult control colors
fabric.Object.prototype.set({
    transparentCorners: false,
    borderColor: '#ff00ff',
    cornerColor: '#007bff'
});

//Design template module
var DesignTemplate = (function() {
    return {
        canvas: null,

        defaultHeight: 600,

        defaultWidth: 600,

        designTexts: [],

        designFontFamily: "American Purpose",

        //creates the canvas with specified height and width
        createCanvas: function(canvasId) {
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

        addDesign: function(options, callback) {
            var self = this;
            fabric.loadSVGFromURL(options.url, function(objects) {
                objects.filter(function(obj) {
                    if (obj.type === "text") {
                        var index = self.designTexts.indexOf(obj.text);
                        if (index == -1) {
                            obj.id = self.designTexts.length + 1;
                            self.designFontFamily = obj.fontFamily;
                            self.designTexts.push(obj.text);
                        }else {
                            obj.id = index + 1;
                        }
                    }
                });
              loadFonts(self.designFontFamily, function() {
                var group = fabric.util.groupSVGElements(objects, {
                    width: options.width,
                    height: options.height,
                    selectable: false
                });
                (options.height >= options.width) ? group.scaleToHeight(self.canvas.getHeight()): group.scaleToWidth(self.canvas.getWidth());
                self.canvas.centerObject(group);
                self.canvas.add(group);
                self.canvas.renderAll();
                callback && callback({
                    fontFamily: self.designFontFamily,
                    texts: self.designTexts
                });
              }, function() {
                  alert('Unable to load fonts');
              });
            });
        },

        changeText: function(id, text) {
            var group = this.canvas.getObjects()[0];
            group.getObjects().filter(function(obj) {
                if (obj.type == "text" && obj.id == id) {
                    obj.text = text;
                }
            });
            group.set('dirty', true);
            this.canvas.renderAll();
        },

        changeFontFamily: function(fontFamily) {
            var group = this.canvas.getObjects()[0];
            group.getObjects().filter(function(obj) {
                if (obj.type == "text") {
                    obj.fontFamily = fontFamily;
                }
            });
            group.set('dirty', true);
            this.canvas.renderAll();
        }




    }
})();
