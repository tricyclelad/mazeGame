//lose 1 point if you're off the fastest path
//gain 5 points on the fastest path
//toggling hints lose 3 points
//toggle shortest path lose 10 points

let Graphics = (function () {
    let context = null,
        m = null,
        mz = null,
        _x = 0,
        _y = -1,
        canvas = null;

    function initialize(x,y,cell_size) {
        createMaze(x,y);
        CanvasRenderingContext2D.prototype.clear = function(currentX, currentY) {
          this.save();
          this.setTransform(1, 0, 0, 1, 0, 0);
          this.clearRect(0, 0, canvas.width, canvas.height);
          this.restore();
        };
    }

    function createMaze(x,y) {
      shortestPath = [];
      breadcrumb = [];
      highscores = [];
      m = new Maze(x,y);

      m.maze[x-1][0].end = true;
      mz = m.maze;
      _x = x;
      _y = y;

      let path = shortestPathFinder(0, y-1, p = []);
      for (let i=0; i < path.length; i++){
        let px = parseInt(path[i].split(',')[0]),
        py = parseInt(path[i].split(',')[1]);

        mz[px][py].score = 5;
        mz[px][py].path = true;
        shortestPath.push([px,py]);
      }

      mz[x-1][0].score = 5;
      mz[0][y-1].score = 0;

      drawMaze(mz, x, y);
    }

    function shortestPathFinder(x,y, path=[]){
      var n = null,
          s = null,
          e = null,
          w = null;

      mz[x][y].visited = true;
      path.push(x + ',' + y);

      if (x == _x-1 && y == 0){
        path.push(x + ',' + y);
        return path;
      }

      var n = (function() {
        if (mz[x][y].up == true && mz[x][y+1].down == true){
          if(mz[x][y+1].visited != true){
            mz[x][y+1].visited = true;
            return shortestPathFinder(x, y+1, path);
          } else {
            return false;
          }
        }
      }());

      var s = (function() {

        if (mz[x][y].down == true && mz[x][y-1].up == true){
          if(mz[x][y-1].visited != true){
            mz[x][y-1].visited = true;
            return shortestPathFinder(x, y-1, path);
          } else {
            return false;
          }
        }
      }());

      var e = (function() {
        if (mz[x][y].right == true && mz[x+1][y].left == true){
          if(mz[x+1][y].visited != true){
            mz[x+1][y].visited = true;
            return shortestPathFinder(x+1, y, path);
          } else {
            return false;
          }
        }
      }());

      var w = (function() {

        if (mz[x][y].left == true && mz[x-1][y].right == true){
          if(mz[x-1][y].visited != true){
            mz[x-1][y].visited = true;
            return shortestPathFinder(x-1, y, path);
          } else {
            return false;
          }
        }
      }());

      if (!n && !s && !e && !w ) {
        path.splice(path.indexOf(x + ',' + y));
      } else {
        return (n || s || e || w);
      }


    }

    function drawMaze(maze, x, y) {
      canvas = $('#mazeCanvas')[0];
      context = canvas.getContext('2d');
      let w = $('#mazeCanvas').width();
      let h = $('#mazeCanvas').height();
      let cell_size = w / x;

      context.translate(0.5,0.5);
      //var startImage=document.getElementById("start.png");
      //var endImage=document.getElementById("end.png");
      //context.beginPath();
      //context.arc(0,h-cell_size,cell_size/2,0,2*Math.PI,false);
      //context.fillStyle = 'red';
      //context.fill();
      //context.lineWidth=1;
      //context.strokeStyle = '#003300 ';
      //context.stroke();

      //mark the beginning
      context.fillStyle = 'red';
      context.fillRect  (0,h-cell_size,cell_size,cell_size);

      //context.beginPath();
      //context.arc(w,0,cell_size/2,0,2*Math.PI,false);
      //context.fillStyle = 'green';
      //context.fill();
      //context.lineWidth=1;
      //context.strokeStyle = '#003300 ';
      //context.stroke();

      //Mark the ending
      context.fillStyle = 'green';
      context.fillRect  (w-cell_size,0,cell_size,cell_size);

      for (let c=0; c < x; c++) {
        for (let r=0; r < y; r++) {
          let i = c*cell_size+0.5;
          let j = r*cell_size+0.5;
          if(maze[c][r].left !== true) {
            context.beginPath();
            context.strokeStyle = 'black';
            context.lineWidth = 5;
            context.moveTo(i,j);
            context.lineTo(i, j+cell_size);
            context.stroke();
          }
          if(maze[c][r].up !== true) {
            context.beginPath();
            context.strokeStyle = 'black';
            context.lineWidth = 5;
            context.moveTo(i,j+cell_size);
            context.lineTo(i+cell_size , j+cell_size);
            context.stroke();
          }
          if(maze[c][r].right !== true) {
            context.beginPath();
            context.strokeStyle = 'black';
            context.lineWidth = 5;            
            context.moveTo(i+cell_size,j+cell_size);
            context.lineTo(i+cell_size, j);
            context.stroke();
          }
          if(maze[c][r].down !== true) {
            context.beginPath();
            context.strokeStyle = 'black';
            context.lineWidth = 5;            
            context.moveTo(i+cell_size,j);
            context.lineTo(i, j);
            context.stroke();
          }
        }

      }

      canvas = $('#spriteCanvas')[0];
      context = canvas.getContext('2d');
    }

    function Sprite(spec) {
        var sprite = {},
            ready = false,
            breadCrumbIsReady = false,
            shortestPathIsReady = false,
            c_size = -1,
            image = new Image(),
            sp_img = new Image(),
            bc_img = new Image();

        image.onload = () => {
            ready = true;
        };

        bc_img.onload = () => {
          breadCrumbIsReady = true;
        };

        sp_img.onload = () => {
          shortestPathIsReady = true;
        }

        sp_img.src = 'grail.png';
        bc_img.src = 'breadCrumb.png';
        image.src = spec.imageSource;

        sprite.init = function(cell_size) {
          c_size = cell_size;
          spec.width = cell_size;
          spec.height = cell_size;
          spec.center.x = 0;
          spec.center.y = 600 - cell_size;
          currentX = parseInt(spec.center.x / cell_size);
          currentY = parseInt(spec.center.y / cell_size);
        }


        sprite.update = function(total_time) {
            breadcrumb.push([currentX, currentY]);

            if(m.maze[currentX][currentY].end == true) {

              highscores.push(score);
              highscores.sort(function(a,b){return b-a});

              $('.first').html(" 1) " + highscores[0]);
              if(highscores[1]){
                $('.second').html(" 2) " + highscores[1]);

              }
              if(highscores[2]){
                $('.third').html(" 3) " + highscores[2]);

              }

              context.clearRect(0,0,canvas.width,canvas.height);

              $('.cnvCont').html('<div class=row><div class="col-md-8 winner" style="border:1px solid #000000;"> \
                Score: ' + score + '<br><br>' + "Time: <br>"
                 + (total_time/1000).toFixed(2) + ' seconds</div></div>');

              score = 0;
              total_time = 0;
              breadcrumb = [];
              shortestPath = [];
            }
            $(".showScore").html("<h2>Score: " + score + " </h2>");

            canvas = $('#breadCrumbCanvas')[0];
            context = canvas.getContext('2d');

            if(breadCrumbIsReady){
              for (let i=0; i < breadcrumb.length; i++){
                context.drawImage(bc_img, breadcrumb[i][0]*c_size+c_size/5 , breadcrumb[i][1]*c_size+c_size/5, c_size/2, c_size/2);
              }
            }

            canvas = $('#spriteCanvas')[0];
            context = canvas.getContext('2d');
        }

        sprite.moveLeft = function(elapsedTime) {
          if(spec.center.x - c_size >= 0 && (mz[currentX][currentY].left || mz[currentX-1][currentY].right)) {
            spec.center.x -= c_size;
            currentX -= 1;

            score += mz[currentX][currentY].score;
            mz[currentX][currentY].score = 0;
          }

        };

        sprite.moveRight = function(elapsedTime) {
          if((spec.center.x + c_size) + c_size <= 600 && (mz[currentX][currentY].right || mz[currentX+1][currentY].left) ) {
            spec.center.x += c_size;

            currentX += 1;

            score += mz[currentX][currentY].score;
            mz[currentX][currentY].score = 0;

          }

        };

        sprite.moveUp = function(elapsedTime) {
          if(spec.center.y - c_size >= 0 && (mz[currentX][currentY].down || mz[currentX][currentY-1].up)){
            spec.center.y -= c_size;
            currentY -= 1;

            score += mz[currentX][currentY].score;
            mz[currentX][currentY].score = 0;
          }
        };

        sprite.moveDown = function(elapsedTime) {
          if((spec.center.y + c_size) + c_size <= 600 && (mz[currentX][currentY].up || mz[currentX][currentY+1].down) ) {
            spec.center.y += c_size;
            currentY += 1;

            score += mz[currentX][currentY].score;
            mz[currentX][currentY].score = 0;

          }
        };

        sprite.score = function() {
          y_count += 1;

          if (y_count % 2 != 0) {
            $(".showScore").removeClass("hidden");

          } else {
            $(".showScore").addClass("hidden");
          }
        };

        sprite.bcTrail = function() {
          b_count += 1;

          if (b_count % 2 != 0) {
            $('#breadCrumbCanvas').removeClass('hidden');

          } else {
            $('#breadCrumbCanvas').addClass('hidden');

          }
        }

        sprite.showPath = function() {
          p_count += 1;
          canvas = $('#shortestPathCanvas')[0];
          context = canvas.getContext('2d');

          for(let i=0; i < breadcrumb.length; i++){
            for(let j=0; j < shortestPath.length; j++) {
              if(breadcrumb[i][0] == shortestPath[j][0] && breadcrumb[i][1] == shortestPath[j][1]) {
                shortestPath.splice(j,1)
              }
            }
          }

          for(let i=0; i < shortestPath.length; i++ ){
            context.drawImage(sp_img, shortestPath[i][0]*c_size+c_size/5 , shortestPath[i][1]*c_size+c_size/5, c_size/2, c_size/2);
          }

          if(p_count % 2 != 0){
            score -= 10;
            $('#shortestPathCanvas').removeClass('hidden');
          } else {
            $('#shortestPathCanvas').addClass('hidden');
            context.clearRect(0,0,canvas.width,canvas.height);
          }

          canvas = $('#spriteCanvas')[0];
          context = canvas.getContext('2d');
        }


        sprite.hint = function() {
          h_count += 1;
          canvas = $('#shortestPathCanvas')[0];
          context = canvas.getContext('2d');
          let dist = [],
              closest_sp = [],
              csp = [];


          for(let i=0; i < breadcrumb.length; i++){
            for(let j=0; j < shortestPath.length; j++) {
              if(breadcrumb[i][0] == shortestPath[j][0] && breadcrumb[i][1] == shortestPath[j][1]) {
                shortestPath.splice(j,1);
              }
            }
          }

          context.drawImage(sp_img, shortestPath[0][0]*c_size+c_size/5 , shortestPath[0][1]*c_size+c_size/5, c_size/2, c_size/2);

          if(h_count % 2 != 0){
            score -= 3;
            $('#shortestPathCanvas').removeClass('hidden');
          } else {
            context.clearRect(0,0,canvas.width,canvas.height);
            dist = [];
            closest_sp = [];
            $('#shortestPathCanvas').addClass('hidden');
          }

          canvas = $('#spriteCanvas')[0];
          context = canvas.getContext('2d');
        }

        sprite.draw = function() {
            if (ready) {
              canvas = $('#spriteCanvas')[0];
              context = canvas.getContext('2d');
                context.save();
                context.translate(spec.center.x+0.5, spec.center.y+0.5);
                context.translate(-(spec.center.x+0.5), -(spec.center.y+0.5));

                context.drawImage(
                    image,
                    spec.center.x,
                    spec.center.y,
                    spec.width, spec.height);

                context.restore();
            }
        }

        return sprite;
    }

    function beginRender() {
        context.clear(currentX, currentY);
    }

    return {
        initialize: initialize,
        beginRender: beginRender,
        Sprite: Sprite

    };

}());

let total_time = 0;
score = 0,
y_count = 0,
p_count = 0,
h_count = 0,
b_count = 0;

let MyGame = (function() {
    let sprite = {};
    let previousTime = performance.now();
    let elapsedTime = 0;
    let inputDispatch = {};
    let mySprite = Graphics.Sprite({
        imageSource: 'knight.png',
        center: { x: 0, y: 570 },
        width: 30,
        height: 30,
    });

    function update(elapsedTime) {
        total_time += elapsedTime;
        mySprite.update(total_time);
    }

    function render() {
      Graphics.beginRender();
      mySprite.draw();
    }

    function gameLoop(time) {
        elapsedTime = time - previousTime;
        previousTime = time;
     //   processInput();
        update(elapsedTime);
        render();
        requestAnimationFrame(gameLoop);
    }

    function keyDown(e) {
        if (inputDispatch.hasOwnProperty(e.key)) {
            inputDispatch[e.key](elapsedTime);
        }
    }
    //function processInput(){
    sprite.initialize = function(x,y,cell_size) {
        Graphics.initialize(x,y,cell_size);
        mySprite.init(cell_size);


        window.addEventListener('keydown', keyDown);


        
        inputDispatch['w'] = mySprite.moveUp;
        inputDispatch['a'] = mySprite.moveLeft;
        inputDispatch['s'] = mySprite.moveDown;
        inputDispatch['d'] = mySprite.moveRight;
        
        inputDispatch['j'] = mySprite.moveLeft;
        inputDispatch['i'] = mySprite.moveUp;
        inputDispatch['l'] = mySprite.moveRight;
        inputDispatch['k'] = mySprite.moveDown;

        
        inputDispatch['h'] = mySprite.hint;
        inputDispatch['b'] = mySprite.bcTrail;
        inputDispatch['p'] = mySprite.showPath;
        inputDispatch['y'] = mySprite.score;

        requestAnimationFrame(gameLoop);
    }

    return sprite;
}());

$(document).ready(function(){

  let sizes = $('.mazeOptions').clone();
  $(".mazeSize").on('click', function(){

    let canvas = $('#breadCrumbCanvas')[0];
    let context = canvas.getContext('2d');
    context.clearRect(0,0, canvas.width, canvas.height);

    canvas = $('#shortestPathCanvas')[0];
    context = canvas.getContext('2d');
    context.clearRect(0,0, canvas.width, canvas.height);

    $(".mazeOptions").addClass('hidden');
    $('.startNewGame').removeClass('hidden');
    score = 0;
    y_count = 0;
    b_count = 0;
    p_count = 0;
    h_count = 0;
    total_time = 0;
  });

  $('.startNewGame').on('click', function(){
    $(".startNewGame").addClass('hidden');
    $('.mazeOptions').removeClass('hidden');
    $('.cnvCont').html("<canvas id='mazeCanvas' width=600 height=600 style='border:1px solid #000000;'></canvas> \
    <canvas id='spriteCanvas' width=600 height=600 style='border:1px solid #000000;'></canvas>\
    <canvas class='hidden' id='breadCrumbCanvas' width=600 height=600 style='border:1px solid #000000;'></canvas>\
    <canvas class='hidden' id='shortestPathCanvas' width=600 height=600 style='border:1px solid #000000;'></canvas>");
  });
})
