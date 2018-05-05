/* author: Martin Lutz, 2017 */

/* jshint esnext:true */
/* jshint jquery:true */
/* jshint browser:true */

/* Breadth-first search through a 2D array from left to right.
*/
class BFS {
   constructor() {
      // Field to operate on.
      this.field2D = [];
      // Taken way as 2D array.
      this.takenWay2D = [];
      // Taken way containing each step as [x, y, taken].
      this.takenWay = [];
   }

   getTakenWay2D() {
      return this.takenWay2D;
   }

   getTakenWay() {
      return this.takenWay;
   }

   run(field2D) {
      this.foundSolution = false;
      this.field2D = field2D.slice();
      this.takenWay2D = this._createArray2D(field2D.length);
      this.takenWay = [];
      let nextSteps = [];

      for (let y = 0; y < field2D.length; y++) {
         if (field2D[0][y] && !this.takenWay2D[0][y]) {
            nextSteps.push([0, y]);
         }
      }
      return this._bfs(nextSteps);
   }

   _bfs(nextSteps) {
      while (nextSteps.length > 0) {
         let nextStep = nextSteps.shift();
         let x = nextStep[0];
         let y = nextStep[1];

         if (!this.takenWay2D[x][y]) {
            this.takenWay2D[x][y] = true;
            this.takenWay.push([x, y, true]);

            if (x == this.field2D[0].length - 1) {
               return true;
            }

            let right = x + 1;
            let left = x - 1;
            let above = y - 1;
            let below = y + 1;

            if (right < this.field2D[0].length) {
               if (this.field2D[right][y] && !this.takenWay2D[right][y]) {
                  nextSteps.push([right, y]);
               }
            }
            if (below < this.field2D.length) {
               if (this.field2D[x][below] && !this.takenWay2D[x][below]) {
                  nextSteps.push([x, below]);
               }
            }
            if (above >= 0) {
               if (this.field2D[x][above] && !this.takenWay2D[x][above]) {
                   nextSteps.push([x, above]);
               }
            }
            if (left >= 0) {
               if (this.field2D[left][y] && !this.takenWay2D[left][y]) {
                  nextSteps.push([left, y]);
               }
            }
         }
      }
      return false;
   }

   _createArray2D(dimension) {
      let array = new Array(dimension);
      for (let x = 0; x < dimension; x++) {
         array[x] = Array.apply(false, new Array(dimension)).map(Boolean);
      }
      return array;
   }
}
