//Overright deafult control colors
fabric.Object.prototype.set({
    transparentCorners: false,
    borderColor: "#ff00ff",
    cornerColor: "#007bff"
});

//Design template module
var DesignTemplate = (function () {
    return {
        canvas: null,

        backgroundColor: "#000",

        defaultHeight: 600,

        defaultWidth: 600,

        maxTextLength: 25,

        maxTextWidth: 0,

        maxTextHeight: 0,

        designTexts: [],

        textObjectInfo: [],

        designFontFamily: "Avenir",

        //get the max width & hight upto which object will scale
        getDimension: function () {
            this.maxTextWidth = Math.max.apply(
                null,
                this.textObjectInfo.map(function (obj) {
                    return obj.width;
                })
            );
            this.maxTextHeight = Math.max.apply(
                null,
                this.textObjectInfo.map(function (obj) {
                    return obj.height;
                })
            );
            this.textObjectInfo.filter(function (obj) {
                obj.left = obj.canvasObj.left;
                obj.top = obj.canvasObj.top;
            });
        },

        //creates the canvas with specified height and width
        createCanvas: function (canvasId) {
            if (!canvasId || !document.getElementById(canvasId))
                throw new Error("Canvas element not found");
            this.canvas = new fabric.Canvas(canvasId, {
                height: this.defaultHeight,
                width: this.defaultWidth,
                selection: false,
                renderOnAddRemove: false,
                backgroundColor: this.backgroundColor
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
                            // width: obj.width,
                            // height: obj.height,
                            width: obj.getScaledWidth(),
                            height: obj.getScaledHeight(),
                            scaleX: obj.scaleX,
                            scaleY: obj.scaleY,
                            fill: obj.fill,
                            stroke: obj.stroke,
                            top: obj.top,
                            left: obj.left
                        });
                    }
                });

                //load the default font used in SVG
                loadFonts(
                    self.designFontFamily,
                    function () {
                        var group = fabric.util.groupSVGElements(objects, {
                            width: options.width,
                            height: options.height,
                            selectable: false
                        });
                        options.height >= options.width ?
                            group.scaleToHeight(self.canvas.getHeight()) :
                            group.scaleToWidth(self.canvas.getWidth());
                        group.scale(0.7);
                        self.canvas.centerObject(group);
                        self.canvas.add(group);
                        self.canvas.renderAll();
                        self.getDimension();
                        callback &&
                            callback({
                                fontFamily: self.designFontFamily,
                                designTexts: self.designTexts,
                                textObjectInfo: self.textObjectInfo
                            });
                    },
                    function () {
                        alert("Unable to load fonts");
                    }
                );
            });
        },

        //change the text
        changeText: function (id, text) {
            var self = this;
            var group = this.canvas.getObjects()[0];
            this.textObjectInfo.filter(function (obj) {
                if (obj.canvasObj.id == id) {
                    obj.canvasObj.text = text;
                    self.designTexts[id - 1] = text;
                    //store text changes in session storage
                    if (id == 1) sessionStorage.setItem("firstName", text);
                    if (id == 2) sessionStorage.setItem("lastName", text);
                }
            });
            group.set("dirty", true);
            this.canvas.renderAll();
            this.resizeText(id);
        },

        //change the font family
        changeFontFamily: function (fontFamily, callback) {
            var group = this.canvas.getObjects()[0];
            this.textObjectInfo.filter(function (obj) {
                obj.canvasObj.fontFamily = fontFamily;
            });
            group.set("dirty", true);
            this.canvas.renderAll();
            //this.resetTextSize(callback);
            this.designTexts.filter(function (text, index) {
                this.resizeText(index + 1);
            });
            // this.resizeText();
        },

        //change text color
        changeColor: function (id, color) {
            this.textObjectInfo[id].canvasObj.fill = color;
            var group = this.canvas.getObjects()[0];
            group.set("dirty", true);
            this.canvas.renderAll();
        },

        /* resize text to fit into the max height/width 
          (Max height/ width is qual to the text node with max height/ width 
            of SVG. So while designing SVG its advisable Put text node such that it will
            cover max design area.)
        */
        resizeText: function (id) {
            var self = this;
            this.textObjectInfo.filter(function (obj) {
                if (obj.canvasObj.id == id) {
                    var width = obj.canvasObj.width;
                    var ratio = self.maxTextWidth / width;
                    if (width > self.maxTextWidth) {
                        obj.canvasObj.scaleToWidth(self.maxTextWidth);
                        // obj.canvasObj.scaleX = ratio * obj.scaleX;
                        obj.canvasObj.scaleY = ratio * obj.scaleY;
                    }
                    obj.canvasObj.left =
                        obj.left +
                        obj.width / 2 -
                        obj.canvasObj.getScaledWidth() / 2;
                    obj.canvasObj.dirty = true;

                }
            });
            var group = self.canvas.getObjects()[0];
            group.set("dirty", true);
            self.canvas.renderAll();
        },

        resetTextSize: function (callback) {
            // var self = this;
            // this.textObjectInfo.filter(function (obj) {
            //     obj.canvasObj.scaleX = obj.scaleX;
            //     obj.canvasObj.scaleY = obj.scaleY;
            //     var width = obj.canvasObj.width;
            //     if (width > self.maxTextWidth) {
            //         obj.canvasObj.scaleX =
            //             (self.maxTextWidth / width) * obj.scaleX;
            //     }
            // });
            // var group = self.canvas.getObjects()[0];
            // group.set("dirty", true);
            // self.canvas.renderAll();
            // callback && callback();

            var self = this;
            this.textObjectInfo.filter(function (obj) {
                var width = obj.canvasObj.width;
                var ratio = self.maxTextWidth / width;
                if (width > self.maxTextWidth) {
                    obj.canvasObj.scaleToWidth(self.maxTextWidth);
                    obj.canvasObj.scaleY = ratio * obj.scaleY;
                }
                obj.canvasObj.left =
                    obj.left +
                    obj.width / 2 -
                    obj.canvasObj.getScaledWidth() / 2;
            });
            var group = self.canvas.getObjects()[0];
            this.reScaleGroup();
            group.set("dirty", true);
            self.canvas.renderAll();
        },

        reScaleGroup: function (scale) {
            scale = scale ? scale : 0.7;
            var group = this.canvas.getObjects()[0];
            group.scale(1);
            this.canvas.renderAll();
            group.scale(scale);
            this.canvas.renderAll();
        },

        //export canvas as data URL
        exportDesign: function () {
            if (!this.canvas) throw new Error("No canvas found");
            return this.canvas.toDataURL();
        },

        clearCanvas: function () {
            if (!this.canvas) throw new Error("No canvas found");
            this.canvas.clear();
            this.maxTextWidth = 0;
            this.maxTextHeight = 0;
            this.designTexts = [];
            this.textObjectInfo = [];
        },

        changeDesign: function (options) {
            var self = this;
            this.clearCanvas();
            this.addDesign({
                    url: options.url
                },
                function () {
                    options.designTexts.filter(function (text, index) {
                        self.changeText(index + 1, text);
                    });
                    self.resetTextSize();
                }
            );
        },

        changeBackgroundColor: function (color) {
            this.backgroundColor = color;
            this.canvas.backgroundColor = color;
            this.canvas.renderAll();
        },

        // changeTemplateText: function (textArray) {
        //     var self = this;
        //     textArray.filter(function (text, index) {
        //         DesignTemplate.textObjectInfo.filter(function (item) {
        //             if (item.canvasObj.id == index + 1) {
        //                 item.canvasObj.text = text;
        //                 self.designTexts[index] = text;
        //             }
        //             self.canvas.renderAll();
        //             var width = item.canvasObj.width;
        //             var ratio = self.maxTextWidth / width;
        //             if (width > self.maxTextWidth) {
        //                 item.canvasObj.scaleToWidth(self.maxTextWidth);
        //                 item.canvasObj.scaleY = ratio * item.scaleY;
        //             }
        //             item.canvasObj.left =
        //                 item.left +
        //                 item.width / 2 -
        //                 item.canvasObj.getScaledWidth() / 2;
        //         });
        //     });

        //     var group = self.canvas.getObjects()[0];
        //     group.set("dirty", true);
        //     self.canvas.backgroundColor = self.backgroundColor;
        //     self.canvas.renderAll();
        // }
    };
})();