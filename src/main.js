/* author: Martin Lutz, 2017 */

/* jshint esnext:true */
/* jshint jquery:true */
/* jshint browser:true */


/* Main function for search algorithms.
*/
$(document).ready(function() {
   let cellNumber = 25;
   let cellProbability = 0.65;
   let drawSpeed = 1000 / 15;
   let resizeSpeed = 150;

   let canvasBG = $("#canvasBG");
   let canvasFG = $("#canvasFG");
   let canvasWrapper = $("#canvasWrapper");
   let contentArea = $("#contentarea");
   let controlArea = $("#dfsControl");

   view = new View(
      cellNumber,
      drawSpeed,
      resizeSpeed,
      canvasBG,
      canvasFG,
      canvasWrapper,
      contentArea,
      controlArea);

   controller = new Controller(
      view,
      cellNumber,
      cellProbability);

   controller.createNewField();
});

var view;
var controller;
