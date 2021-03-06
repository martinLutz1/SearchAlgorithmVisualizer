/* Author: Martin Lutz, 2017 */

/* jshint esnext:true */
/* jshint jquery:true */
/* jshint browser:true */


/* Represents the painter that draws on the canvas elements
*  (background and foreground).
*  The background represents the field and on the foreground
*  we draw the way and start/end points.
*
*  @param canvasBG:   Background canvas.
*  @param canvasFG:   Foreground canvas.
*  @param cellNumber: Size of the field in number of cells.
*/
class Painter {
   constructor(canvasBG, canvasFG, cellNumber) {
      // Way properties.
      this.wayBorderColour = "#666666";
      this.wayFillColour = "#EDEDED";
      this.wayLineWidth = 3.0;

      // Star properties.
      this.starBorderColour = "#555555";
      this.starFillColour = "#997923";
      this.starLineWidth = 4.0;

      // Circle properties.
      this.circleBorderColour = "#777777";
      this.circleFillColour = "#c4ffbc";
      this.circleLineWidth = 4.0;

      // Canvas elements.
      this.dfsCanvasBG = canvasBG;
      this.dfsCanvasFG = canvasFG;
      this.dfsCtxBG = canvasBG.getContext("2d");
      this.dfsCtxFG = canvasFG.getContext("2d");
      this.dfsCtxFG.imageSmoothingEnabled = true;

      // Field properties.
      this.windowWidth = 0;
      this.windowHeight = 0;
      this.fieldWidth = 0;
      this.offset = 0;
      this.borderDist = 0;
      this.field2D = [];

      this.setFieldDimension(cellNumber);
   }

   setFieldDimension(cellNumber) {
      this.windowWidth = this.dfsCanvasBG.width;
      this.windowHeight = this.dfsCanvasBG.height;
      this.fieldWidth = Math.min(this.windowHeight, this.windowWidth);
      this.offset = this.fieldWidth / cellNumber;
      this.borderDist = this.offset / 6;
   }

   setField2D(field2D) {
      this.field2D = field2D.slice();
      this._clearForeground();
   }

   drawForeground(takenWay) {
      // No way = nothing to draw;
      if (takenWay.length === 0) {
         return;
      }

      this._clearForeground();
      this.dfsCtxFG.beginPath();

      for (let step = 0; step < takenWay.length; step++) {
         let x = takenWay[step][0];
         let y = takenWay[step][1];
         this._drawStarOnFG(x, y, 5);
      }

      this.dfsCtxFG.closePath();
   }

   drawBackground() {
      // No field = nothing to draw.
      if (this.field2D.length === 0) {
         return;
      }

      this._clearBackground();
      this.dfsCtxBG.beginPath();

      for (let x = 0; x < this.field2D.length; x++) {
         for (let y = 0; y < this.field2D[0].length; y++) {
            if (this.field2D[x][y]) {
               let connectedTo = this._connections(x, y);

               /*------------------ 4 sides ------------------*/
               // 4 sides connected
               if (connectedTo[0] && connectedTo[1] &&
                   connectedTo[2] && connectedTo[3]) {
                  this._draw4ConnectedOnBG(x, y);
               }

               /*------------------ 3 sides ------------------*/
               // 3 sides connected - no top
               else if (!connectedTo[0] && connectedTo[1] &&
                        connectedTo[2] && connectedTo[3]) {
                  this._draw3ConnectedOnBG(x, y, 0);
               }
               // 3 sides connected - no right
               else if (connectedTo[0] && !connectedTo[1] &&
                        connectedTo[2] && connectedTo[3]) {
                  this._draw3ConnectedOnBG(x, y, 90);
               }
               // 3 sides connected - no bottom
               else if (connectedTo[0] && connectedTo[1] &&
                        !connectedTo[2] && connectedTo[3]) {
                  this._draw3ConnectedOnBG(x, y, 180);
               }
               // 3 sides connected - no left
               else if (connectedTo[0] && connectedTo[1] &&
                        connectedTo[2] && !connectedTo[3]) {
                  this._draw3ConnectedOnBG(x, y, 270);
               }

               /*------------------ 2 sides ------------------*/
               // 2 sides connected - top and right
               else if (connectedTo[0] && connectedTo[1] &&
                     !connectedTo[2] && !connectedTo[3]) {
                  this._draw2ConnectedEdgeOnBG(x, y, 0);
               }
               // 2 sides connected - bottom and right
               else if (!connectedTo[0] && connectedTo[1] &&
                        connectedTo[2] && !connectedTo[3]) {
                  this._draw2ConnectedEdgeOnBG(x, y, 90);
               }
               // 2 sides connected - bottom and left
               else if (!connectedTo[0] && !connectedTo[1] &&
                        connectedTo[2] && connectedTo[3]) {
                  this._draw2ConnectedEdgeOnBG(x, y, 180);
               }
               // 2 sides connected - top and left
               else if (connectedTo[0] && !connectedTo[1] &&
                        !connectedTo[2] && connectedTo[3]) {
                  this._draw2ConnectedEdgeOnBG(x, y, 270);
               }
               // 2 sides connected - left and right
               else if (!connectedTo[0] && connectedTo[1] &&
                        !connectedTo[2] && connectedTo[3]) {
                  this._draw2ConnectedLineOnBG(x, y, 0);
               }
               // 2 sides connected - top and bottom
               else if (connectedTo[0] && !connectedTo[1] &&
                        connectedTo[2] && !connectedTo[3]) {
                  this._draw2ConnectedLineOnBG(x, y, 90);
               }

               /*------------------ 1 side ------------------*/
               // 1 side connected - top
               else if (connectedTo[0] && !connectedTo[1] &&
                        !connectedTo[2] && !connectedTo[3]) {
                  this._draw1ConnectedOnBG(x, y, 0);
               }
               // 1 side connected - right
               else if (!connectedTo[0] && connectedTo[1] &&
                        !connectedTo[2] && !connectedTo[3]) {
                  this._draw1ConnectedOnBG(x, y, 90);
               }
               // 1 side connected - bottom
               else if (!connectedTo[0] && !connectedTo[1] &&
                        connectedTo[2] && !connectedTo[3]) {
                  this._draw1ConnectedOnBG(x, y, 180);
               }
               // 1 side connected - left
               else if (!connectedTo[0] && !connectedTo[1] &&
                        !connectedTo[2] && connectedTo[3]) {
                  this._draw1ConnectedOnBG(x, y, 270);
               }

               /*------------------ 0 sides ------------------*/
               // 0 sides connected
               else if (!connectedTo[0] && !connectedTo[1] &&
                        !connectedTo[2] && !connectedTo[3]) {
                  this._draw0ConnectedOnBG(x, y);
               }
            }
         }
      }
      this.dfsCtxBG.stroke();
      this.dfsCtxBG.fill();
      this.dfsCtxBG.closePath();

      // Most left and most right cells.
      for (let y = 0; y < this.field2D[0].length; y++) {
         if (this.field2D[0][y]) {
            this._drawCircleOnBG(0, y);
         }

         if (this.field2D[this.field2D.length - 1][y]) {
            this._drawCircleOnBG(this.field2D.length - 1, y);
         }
      }
   }

   _clearBackground() {
      this.dfsCtxBG.clearRect(0, 0, this.windowWidth, this.windowHeight);
      this.dfsCtxBG.strokeStyle = this.wayBorderColour;
      this.dfsCtxBG.fillStyle = this.wayFillColour;
      this.dfsCtxBG.lineWidth = this.wayLineWidth;
   }

   _clearForeground() {
      this.dfsCtxFG.clearRect(0, 0, this.windowWidth, this.windowHeight);
   }

   _draw4ConnectedOnBG(x, y) {
      x = x * this.offset;
      y = y * this.offset;

      // Top left.
      this.dfsCtxBG.moveTo(x, y + this.borderDist);
      this.dfsCtxBG.lineTo(x + this.borderDist, y + this.borderDist);
      this.dfsCtxBG.lineTo(x + this.borderDist, y);

      // Top right.
      this.dfsCtxBG.lineTo(x + this.offset - this.borderDist, y);
      this.dfsCtxBG.lineTo(x + this.offset - this.borderDist, y + this.borderDist);
      this.dfsCtxBG.lineTo(x + this.offset, y + this.borderDist);

      // Bottom right.
      this.dfsCtxBG.lineTo(x + this.offset, y + this.offset - this.borderDist);
      this.dfsCtxBG.lineTo(x + this.offset - this.borderDist, y + this.offset - this.borderDist);
      this.dfsCtxBG.lineTo(x + this.offset - this.borderDist, y + this.offset);

      // Bottom left.
      this.dfsCtxBG.lineTo(x + this.borderDist, y + this.offset);
      this.dfsCtxBG.lineTo(x + this.borderDist, y + this.offset - this.borderDist);
      this.dfsCtxBG.lineTo(x, y + this.offset - this.borderDist);
      this.dfsCtxBG.lineTo(x, y + this.borderDist);
   }

   _draw3ConnectedOnBG(x, y, rotationDegree) {
      x = x * this.offset;
      y = y * this.offset;
      let centerX = x + this.offset / 2;
      let centerY = y + this.offset / 2;

      this.dfsCtxBG.translate(centerX, centerY);
      this.dfsCtxBG.rotate(rotationDegree * Math.PI / 180);
      this.dfsCtxBG.translate(-centerX, -centerY);

      // Bottom left.
      this.dfsCtxBG.moveTo(x, y + this.offset - this.borderDist);
      this.dfsCtxBG.lineTo(x + this.borderDist, y + this.offset - this.borderDist);
      this.dfsCtxBG.lineTo(x + this.borderDist, y + this.offset);

      // Bottom right.
      this.dfsCtxBG.lineTo(x + this.offset - this.borderDist, y + this.offset);
      this.dfsCtxBG.lineTo(x + this.offset - this.borderDist, y + this.offset - this.borderDist);
      this.dfsCtxBG.lineTo(x + this.offset, y + this.offset - this.borderDist);

      // Top.
      this.dfsCtxBG.lineTo(x + this.offset, y + this.borderDist);
      this.dfsCtxBG.lineTo(x, y + this.borderDist);
      this.dfsCtxBG.lineTo(x, y + this.offset - this.borderDist);

      // Reset Transformation.
      this.dfsCtxBG.setTransform(1, 0, 0, 1, 0, 0);
   }

   _draw2ConnectedEdgeOnBG(x, y, rotationDegree) {
      x = x * this.offset;
      y = y * this.offset;
      let centerX = x + this.offset / 2;
      let centerY = y + this.offset / 2;

      this.dfsCtxBG.translate(centerX, centerY);
      this.dfsCtxBG.rotate(rotationDegree * Math.PI / 180);
      this.dfsCtxBG.translate(-centerX, -centerY);

      // Top right.
      this.dfsCtxBG.moveTo(x + this.offset, y + this.borderDist);
      this.dfsCtxBG.lineTo(x + this.offset - this.borderDist, y + this.borderDist);
      this.dfsCtxBG.lineTo(x + this.offset - this.borderDist, y);

      // Bottom and left outside.
      this.dfsCtxBG.lineTo(x + this.borderDist, y);
      this.dfsCtxBG.lineTo(x + this.borderDist, y + this.offset - this.borderDist);
      this.dfsCtxBG.lineTo(x + this.offset, y + this.offset - this.borderDist);
      this.dfsCtxBG.lineTo(x + this.offset, y + this.borderDist);

      // Reset Transformation.
      this.dfsCtxBG.setTransform(1, 0, 0, 1, 0, 0);
   }

   _draw2ConnectedLineOnBG(x, y, rotationDegree) {
      x = x * this.offset;
      y = y * this.offset;
      let centerX = x + this.offset / 2;
      let centerY = y + this.offset / 2;

      this.dfsCtxBG.translate(centerX, centerY);
      this.dfsCtxBG.rotate(rotationDegree * Math.PI / 180);
      this.dfsCtxBG.translate(-centerX, -centerY);

      // Upper line.
      this.dfsCtxBG.moveTo(x, y + this.borderDist);
      this.dfsCtxBG.lineTo(x + this.offset, y + this.borderDist);

      // Lower line.
      this.dfsCtxBG.lineTo(x + this.offset, y + this.offset - this.borderDist);
      this.dfsCtxBG.lineTo(x, y + this.offset - this.borderDist);
      this.dfsCtxBG.lineTo(x, y + this.borderDist);

      // Reset Transformation.
      this.dfsCtxBG.setTransform(1, 0, 0, 1, 0, 0);
   }

   _draw1ConnectedOnBG(x, y, rotationDegree) {
      x = x * this.offset;
      y = y * this.offset;
      let centerX = x + this.offset / 2;
      let centerY = y + this.offset / 2;

      this.dfsCtxBG.translate(centerX, centerY);
      this.dfsCtxBG.rotate(rotationDegree * Math.PI / 180);
      this.dfsCtxBG.translate(-centerX, -centerY);

      // Left, bottom and right.
      this.dfsCtxBG.moveTo(x + this.borderDist, y);
      this.dfsCtxBG.lineTo(x + this.borderDist, y + this.offset - this.borderDist);
      this.dfsCtxBG.lineTo(x + this.offset - this.borderDist, y + this.offset - this.borderDist);
      this.dfsCtxBG.lineTo(x + this.offset - this.borderDist, y);
      this.dfsCtxBG.lineTo(x + this.borderDist, y);

      // Reset Transformation.
      this.dfsCtxBG.setTransform(1, 0, 0, 1, 0, 0);
   }

   _draw0ConnectedOnBG(x, y) {
      x = x * this.offset;
      y = y * this.offset;
      let size = this.offset - 2 * this.borderDist;

      this.dfsCtxBG.rect(x + this.borderDist, y + this.borderDist, size, size);
   }

   _drawStarOnFG(x, y, n) {
      let cX = (x * this.offset) + (this.offset / 2);
      let cY = (y * this.offset) + (this.offset / 2);
      let radius = Math.max((this.offset / 4 - 1), 1);

      // Set 
      this.dfsCtxFG.strokeStyle = this.starBorderColour;
      this.dfsCtxFG.fillStyle = this.starFillColour;
      if (radius <= 3) {
         this.dfsCtxFG.lineWidth = 2;
      }
      else {
         this.dfsCtxFG.lineWidth = this.starLineWidth;
      }

      this.dfsCtxFG.beginPath();
      this.dfsCtxFG.moveTo(cX + radius, cY);

      for (let i = 1; i <= n * 2; i++)
      {
         let theta = i * (Math.PI * 2) / (n * 2);
         let radiusDistance = ((i % 2 === 0) ? radius : (radius / 2));

         let xPos = cX + (radiusDistance * Math.cos(theta));
         let yPos = cY + (radiusDistance * Math.sin(theta));
         this.dfsCtxFG.lineTo(xPos, yPos);
      }

      this.dfsCtxFG.closePath();
      this.dfsCtxFG.stroke();
      this.dfsCtxFG.fill();
   }

   _drawCircleOnBG(x, y) {
      x = Math.min((x * this.offset) + (this.offset / 2));
      y = Math.min((y * this.offset) + (this.offset / 2));
      let radius = Math.floor(this.offset / 3 - 2);
      if (radius < 1) {
         radius = 1;
      }
      this.dfsCtxBG.beginPath();

      this.dfsCtxBG.strokeStyle = this.circleBorderColour;
      this.dfsCtxBG.fillStyle = this.circleFillColour;
      this.dfsCtxBG.lineWidth = this.circleLineWidth;

      this.dfsCtxBG.arc(x, y, radius, 0, 2*Math.PI);

      this.dfsCtxBG.stroke();
      this.dfsCtxBG.fill();

      this.dfsCtxBG.closePath();
   }

   _connections(x, y) {
      let cellNumber = this.field2D.length;

      let topConnected = (y > 0) && this.field2D[x][y - 1];
      let rightConnected = (x < cellNumber - 1) && this.field2D[x + 1][y];
      let bottomConnected = (y < cellNumber - 1) && this.field2D[x][y + 1];
      let leftConnected = (x > 0) && this.field2D[x - 1][y];

      return [topConnected, rightConnected, bottomConnected, leftConnected];
   }

}
