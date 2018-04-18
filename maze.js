class Maze {
  constructor(x,y) {
    this.x = parseInt(x);
    this.y = parseInt(y);
    this.total_cells = x*y;
  }

  initializeMaze() {
    var maze = new Array();
//Prim
    for (let i = 0; i < this.x; i++) {
      maze[i] = new Array();
      for (let j = 0; j < this.y; j++) {
        maze[i][j] = { 
          x:i, 
          y:j, 
          up: false, 
          down: false, 
          right: false, 
          left: false, 
          visited: false, 
          path: null, 
          end: false, 
          score: -1 };
      }
    }
    return maze;

  }


  generateRandomMaze(maze) {
    //Select a random cell on the maze to begin Prim
    let currentX = parseInt(Math.random() * (this.x-1));
    let currentY = parseInt(Math.random() * (this.y-1));
    let x = this.x;
    let y = this.y;

    let visited = true;
          
    let neighbors = [];
    let unvisited = [];

    let randNeighbor = -1;
    let randUnivisited = -1;

    maze[currentX][currentY].path = true;

    function addNeighbors(unvisited, X, Y) {
      if(maze[X][Y+1] && maze[X][Y+1].path !== true && unvisited.indexOf(X + ',' + (Y+1)) < 0) {
        unvisited.push(X + ',' + (Y+1));
      }
      if(maze[X][Y-1] && maze[X][Y-1].path !== true && unvisited.indexOf(X + ',' + (Y-1)) < 0) {
        unvisited.push(X + ',' + (Y-1));
      }
      if(maze[X+1] && maze[X+1][Y] && maze[X+1][Y].path !== true && unvisited.indexOf((X+1) + ','+ Y) < 0) {
        unvisited.push((X+1) + ',' + Y);
      }
      if(maze[X-1] && maze[X-1][Y] && maze[X-1][Y].path !== true && unvisited.indexOf((X-1) + ','+ Y) < 0) {
        unvisited.push((X-1) + ',' + Y);
      }
      
     
    }

    addNeighbors(unvisited, currentX, currentY);

    
    while(unvisited.length!==0) {
      randUnivisited = parseInt(Math.random() * (unvisited.length-1));

      currentX = parseInt(unvisited[randUnivisited].split(',')[0]);
      currentY = parseInt(unvisited[randUnivisited].split(',')[1]);

      unvisited.splice(randUnivisited, 1);

      if (currentY+1 < y && maze[currentX][currentY+1].path === true) {
        neighbors.push('up');
      }
      if (currentX-1 >= 0 && maze[currentX-1][currentY].path === true) {
        neighbors.push('left');
      }
      if (currentY-1 >= 0 && maze[currentX][currentY - 1].path === true) {
        neighbors.push('down');
      }
      if (currentX+1 < x && maze[currentX+1][currentY].path === true) {
        neighbors.push('right');
      }

      if (neighbors.length > 1) {
        randNeighbor = parseInt(Math.random() * (neighbors.length-1));
      } else {
        randNeighbor = 0;
      }

      maze[currentX][currentY].path = true;

      if (neighbors[randNeighbor] == 'up') {
        maze[currentX][currentY].up = true;
        maze[currentX][currentY+1].down = true;
      } else if (neighbors[randNeighbor] == 'left') {
        maze[currentX][currentY].left = true;
        maze[currentX-1][currentY].right = true;
      } else if (neighbors[randNeighbor] == 'down') {
        maze[currentX][currentY].down = true;
        maze[currentX][currentY-1].up = true;
      } else if (neighbors[randNeighbor] == 'right') {
        maze[currentX][currentY].right = true;
        maze[currentX+1][currentY].left = true;
      }

      addNeighbors(unvisited, currentX, currentY);

      neighbors = [];

    }

    maze[x-1][0].end = true;
    return maze;
  }
  get maze() {
    return this.generateRandomMaze(this.initializeMaze());
  }

}
