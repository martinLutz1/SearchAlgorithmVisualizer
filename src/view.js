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
      this.wayToDraw = [];
      this.drawnWay = [];
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
      this.painter.drawForeground(this.drawnWay);
   }

   startDrawingForeground(takenWay) {
      this._resetForeground();
      this.wayToDraw = takenWay.slice();

      this.nextStepTimer = window.setInterval(
         this._drawNextStepOnForeground,
         this.drawingSpeed);
   }

   _drawNextStepOnForeground() {
      let self = window.viewRef;
      if (self.wayToDraw.length === 0) {
         window.clearInterval(self.nextStepTimer);
         return;
      }

      let visited = self.wayToDraw[0][2];

      // Put the next step into drawnWay.
      if (visited) {
         self.drawnWay.push(self.wayToDraw[0]);
      }
      // Or remove the last step if the next step is to leave a field.
      else {
         self.drawnWay.pop();
      }

      // Remove the next step from wayToDraw.
      self.wayToDraw.splice(0, 1);

      window.requestAnimationFrame(() => self.painter.drawForeground(self.drawnWay));
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
      this.wayToDraw = [];
      this.drawnWay = [];
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
      let viewHeight = newHeight - 30;
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
}
