/* Author: Martin Lutz, 2017 */

/* jshint esnext:true */
/* jshint jquery:true */
/* jshint browser:true */


/* Controller which handles the model and interaction with the view.
*
*  @param view:            Reference to the view.
*  @param cellNumber:      Size of the field in number of cells.
*  @param cellProbability: Probability to mark a cell as way.
*/
class Controller {
   constructor(view, cellNumber, cellProbability) {
      this.view = view;
      this.field = new Field(cellNumber, cellProbability);
      this.dfs = new DFS();
   }

   setCellNumber(newCellNumber) {
      this.field.setFieldSize(newCellNumber);
   }

   setCellProbability(newCellProbability) {
      let newCellProbabilityInPercent = newCellProbability / 100;
      this.field.setCellProbability(newCellProbabilityInPercent);
   }

   setSpeed(newSpeed) {
      let newSpeedInStepsPerSecond = 1000 / newSpeed;
      if (newSpeedInStepsPerSecond !== this.view.drawingSpeed) {
         this.view.setDrawingSpeed(newSpeedInStepsPerSecond);
      }
   }

   createNewField() {
      this.field.createField2D();
      this.view.setField2D(this.field.getField2D(), this.field.getFieldSize());
      this.view.drawAll();
   }

   runDfs() {
      this.dfs.run(this.field.field2D);
      let takenWay = this.dfs.getTakenWay();
      this.view.startDrawingForeground(takenWay);
   }
}
