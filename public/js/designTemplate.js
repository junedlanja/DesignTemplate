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

        //creates the canvas with specified height and width
        createCanvas: function (canvasId) {
            if (!canvasId || !document.getElementById(canvasId))
                throw new Error('Canvas element not found');
            this.canvas = new fabric.Canvas(canvasId, {
                height: this.defaultHeight,
                width: this.defaultWidth
            });
            return this.canvas;
        },

        addDesign: function (url) {
            var self = this;
            fabric.loadSVGFromURL(url, function (objects) {
                var group = new fabric.Group(objects);
                self.canvas.add(group);
                self.canvas.renderAll();
            });
        }


    }
})();