/* Author: Martin Lutz, 2017 */

/* jshint esnext:true */
/* jshint jquery:true */
/* jshint browser:true */


/* Represents the canvas widget and handles all drawing operations.
*  Note: This class is highly specified to the website of Martin Lutz.
*
*  @param cellNumber:    Size of the field in number of cells.
*  @param drawSpeed:     Interval in ms at which the next step will be drawn.
*  @param resizeDelay:   Delay in ms after which the canvas will be resized
*                        if no further window resizing takes place in this
*                        time window.
*  @param canvasBG:      Background canvas.
*  @param canvasFG:      Foreground canvas.
*  @param canvasWrapper: Div that wrapps the canvas elements.
*  @param contentArea:   Element (e.g. div) that defines the maximum width.
*  @param controlArea:   Div that contains all control elements.
*/
class View {
   constructor(
      cellNumber, drawSpeed, resizeDelay,
      canvasBG, canvasFG, canvasWrapper, contentArea, controlArea) {

      // Drawing area size properties.
      this.oldWidth = 0;
      this.oldHeight = 0;

      // Contains elements in the form: [x, y, true / false],
      // where true = step on field and false = leave field.
      this.takenWay = [];
      this.takenWay2D = [];
      this.cellNumber = cellNumber;
      // Step timer properties.
      this.drawingSpeed = drawSpeed;
      this.nextStepTimer = null;

      // Resize timer properties.
      this.resizeTimer = null;
      this.resizeDelay = resizeDelay;

      this.contentArea = contentArea;
      this.controlArea = controlArea;
      this.window = $(window);
      this.canvasElements = [canvasBG[0], canvasFG[0], canvasWrapper[0]];
      this.painter = new Painter(canvasBG[0], canvasFG[0], cellNumber);

      window.addEventListener("resize", this._startResizeTimer);
      window.viewRef = this;
      this._resizeView();
   }

   setField2D(field2D, cellNumber) {
      if (this.nextStepTimer !== null) {
         clearInterval(this.nextStepTimer);
      }
      this.cellNumber = cellNumber;
      this._resetForeground();

      this.painter.setField2D(field2D);
      this.painter.setFieldDimension(cellNumber);
   }

   setDrawingSpeed(drawingSpeed) {
      this.drawingSpeed = drawingSpeed;

      if (this.nextStepTimer !== null) {
         window.clearInterval(this.nextStepTimer);
         this.nextStepTimer = window.setInterval(
            this._drawNextStepOnForeground,
            this.drawingSpeed);
      }
   }

   drawAll() {
      this.painter.drawBackground();
      this.painter.drawForeground(this.takenWay2D);
   }

   startDrawingForeground(takenWay) {
      this._resetForeground();
      this.takenWay = takenWay.slice();

      this.nextStepTimer = window.setInterval(
         this._drawNextStepOnForeground,
         this.drawingSpeed);
   }

   _drawNextStepOnForeground() {
      let self = window.viewRef;
      if (self.takenWay.length === 0) {
         window.clearInterval(self.nextStepTimer);
         return;
      }
      var x = self.takenWay[0][0];
      var y = self.takenWay[0][1];
      var visited = self.takenWay[0][2];

      // Draw way.
      self.takenWay2D[x][y] = visited;
      self.painter.drawForeground(self.takenWay2D);

      // Remove processed item.
      self.takenWay.splice(0, 1);
   }

   _startResizeTimer(evt) {
      let self = evt.target.viewRef;
      if (self.resizeTimer !== null) {
         window.clearTimeout(self.resizeTimer);
      }
      self.resizeTimer = window.setTimeout(
         self._resizeView,
         self.resizeDelay);
   }

   _resetForeground() {
      if (this.nextStepTimer !== null) {
         window.clearInterval(this.nextStepTimer);
      }
      this.takenWay = [];
      this.takenWay2D = this._createArray2D(this.cellNumber);
   }

   _resizeView() {
      let self = window.viewRef;

      let newWidth = self.contentArea.width();
      let newHeight = self.window.height();

      // No size change, do nothing.
      if (self.oldWidth === newWidth && self.oldHeight === newHeight) {
         return;
      }

      // Apply new size.
      let viewWidth =  newWidth - self.controlArea.width() - 45;
      let viewHeight = newHeight * 0.9;
      let size = Math.min(viewWidth, viewHeight);
      self.canvasElements.forEach(function (element) {
         element.width = size;
         element.height = size;
         element.style.width = String(size) + "px";
         element.style.height = String(size) + "px";
      });

      self.painter.setFieldDimension(self.cellNumber);
      self.drawAll();

      // Save new size.
      self.oldWidth = newWidth;
      self.oldHeight = newHeight;
   }

   _createArray2D(dimension) {
      let array = new Array(dimension);
      for (let x = 0; x < dimension; x++) {
         array[x] = Array.apply(false, new Array(dimension)).map(Boolean);
      }
      return array;
   }
}
