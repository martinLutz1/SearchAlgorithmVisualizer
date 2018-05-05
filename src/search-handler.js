/* author: Martin Lutz, 2018 */

/* jshint esnext:true */
/* jshint jquery:true */
/* jshint browser:true */

/* Enum of available searches */
let SearchMode = Object.freeze({
    DFS : 0,
    BFS : 1
});

/* Holds all search algorithm instances and manages them
* via SearchVisualizer.SearchMode.
*/
class SearchHandler {
   constructor() {
      this.dfs = new DFS();
      this.bfs = new BFS();
      this.searchMode = SearchMode.DFS;
   }

   setSearch(searchMode) {
      this.searchMode = searchMode;
   }

   runSearch(field2D) {
      switch (this.searchMode) {
         case SearchMode.DFS:
            return this._runDfs(field2D);
         case SearchMode.BFS:
            return this._runBfs(field2D);
         default:
            throw "Search mode" + this.searchMode +  " is not supported.";
      }
   }

   _runDfs(field2D) {
      this.dfs.run(field2D);
      return this.dfs.getTakenWay();
   }

   _runBfs(field2D) {
      this.bfs.run(field2D);
      return this.bfs.getTakenWay();
   }
}
