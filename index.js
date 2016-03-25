var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 5000));
app.set("jsonp callback", true);
app.enable("jsonp callback");
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/nextgen', function(req, res) {
  var width = parseInt(req.query.M, 10);
  var height = parseInt(req.query.N, 10);
  liveCells = req.query.liveCells;

  var cells = {};
  liveCells.forEach(function(liveCell) {
    var x = parseInt(liveCell[0], 10);
    var y = parseInt(liveCell[1], 10);
    var location = [x, y];

    aggregateCell(cells, location, 0, true);

    var neighbors = getNeighbors(x, y, width, height);
    neighbors.forEach(function(neighbor) {
      var neighborLocation = [neighbor[0], neighbor[1]];
      aggregateCell(cells, neighborLocation, 1, false);
    });
  });

  var nextGeneration = getNextGeneration(cells);

  res.header('Content-type','application/json');
  res.header('Charset','utf8');
  res.send(req.query.callback + '(' + JSON.stringify(nextGeneration) + ');');
});

function getNeighbors(x, y, width, height) {
  var maxX = width - 1;
  var maxY = height - 1;
  var neighborCells = [];
  // If x is not zero, add the left neighbor
  if (x > 0) {
    neighborCells.push([x-1, y]);
    // If y is not zero, add the top-left neighbor
    if (y > 0) neighborCells.push([x-1, y-1]);
    // If y is not max, add the bottom-left neighbor
    if (y < maxY) neighborCells.push([x-1, y+1]);
  }
  // If x is not max, add the right neighbor
  if (x < maxX) {
    neighborCells.push([x+1, y]);
    // If y is not zero, add the top-right neighbor
    if (y > 0) neighborCells.push([x+1, y-1]);
    // If y is not max, add the bottom-right neighbor
    if (y < maxY) neighborCells.push([x+1, y+1]);
  }
  // If y is not zero, add the bottom neighbor
  if (y > 0) neighborCells.push([x, y-1]);
  // If y is not max, add the top neighbor
  if (y < maxY) neighborCells.push([x, y+1]);

  return neighborCells;
}

function aggregateCell(cells, location, count, live) {
  if (location in cells) {
    cells[location].count += count;
    // When we get the neighbors of a liveCell, we don't know whether
    // or not the neighbor is another liveCell, so they all get stored
    // for the first time with a live value of false. This value only
    // gets updated if we come across the cell again as a liveCell. 
    if (live) cells[location].live = live;
  } else {
    cells[location] = {count:count, live:live};
  }
}

function getNextGeneration(cells) {
  var nextGeneration = [];
  for(var key in cells) {
    var cell = cells[key];
    if ((cell.count == 3) || (cell.live && cell.count == 2)){
      var coordinates = key.split(',');
      var x = Number(coordinates[0]);
      var y = Number(coordinates[1]);
      nextGeneration.push([x,y]);
    }
  }
  return nextGeneration;
}