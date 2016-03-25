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

app.get('/', function(request, response) {
  response.render('pages/index');
});

function getNeighbors(x, y, width, height) {
  var maxX = width - 1;
  var maxY = height - 1;
  var neighborCells = [];
  if (x != 0) {
    neighborCells.push([x-1, y]);
    if (y != 0) neighborCells.push([x-1, y-1]);
    if (y != maxY) neighborCells.push([x-1, y+1]);
  }
  if (x != maxX) {
    neighborCells.push([x+1, y]);
    if (y != 0) neighborCells.push([x+1, y-1]);
    if (y != maxY) neighborCells.push([x+1, y+1]);
  }
  if (y != 0) neighborCells.push([x, y-1]);
  if (y != maxY) neighborCells.push([x, y+1]);

  return neighborCells;
}

app.get('/nextgen', function(req, res) {
  var width = Number(req.query.M);
  var height = Number(req.query.N);
  try {   
    var liveCells = req.query.liveCells;
  } catch (e) {
    return console.error(e);
  }

  var cells = {};
  liveCells.forEach(function(liveCell) {
    var x = Number(liveCell[0]);
    var y = Number(liveCell[1]);
    var location = [x, y];

    if (location in cells)
      cells[location].live = true;
    else
      cells[location] = {count:0, live:true};

    var neighbors = getNeighbors(x, y, width, height);
    neighbors.forEach(function(neighbor) {
      var neighborLocation = [neighbor[0], neighbor[1]];
      if (neighborLocation in cells)
        cells[neighborLocation].count += 1;
      else
        cells[neighborLocation] = {count:1, live:false};
    });
  });

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

  res.header('Content-type','application/json');
  res.header('Charset','utf8');
  res.send(req.query.callback + '(' + JSON.stringify(nextGeneration) + ');');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});