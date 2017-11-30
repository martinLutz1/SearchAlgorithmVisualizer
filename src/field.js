/* author: Martin Lutz, 2017 */

/* jshint esnext:true */
/* jshint jquery:true */
/* jshint browser:true */

/* Represents the field as 2D boolean array.
*
*  @param cellNumber:      Size of the field.
*  @param cellProbability: Probability to mark a cell as true.
*/
class Field {
   constructor(cellNumber, cellProbability) {
      this.cellNumber = cellNumber;
      this.cellProbability = cellProbability;
      this.field2D = [];
   }

   setFieldSize(cellNumber) {
      this.cellNumber = cellNumber;
   }

   setCellProbability(cellProbability) {
      this.cellProbability = cellProbability;
   }

   getFieldSize() {
      return this.cellNumber;
   }

   getField2D() {
      return this.field2D;
   }

   createField2D() {
      this.field2D =  this._createArray2D(this.cellNumber);
      for (let x = 0; x < this.cellNumber; x++) {
         for (let y = 0; y < this.cellNumber; y++) {
            if (Math.random() <= this.cellProbability) {
               this.field2D[x][y] = true;
            }
         }
      }
   }

   _createArray2D(dimension) {
      let array = new Array(dimension);
      for (let x = 0; x < dimension; x++) {
         array[x] = Array.apply(false, new Array(dimension)).map(Boolean);
      }
      return array;
   }
}
