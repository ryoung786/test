var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 5000));
app.set("jsonp callback", true);
app.enable("jsonp callback");
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
	response.render('pages/index');
});

function getNeighbors(x, y, m, n) {
	neighborCells = [];
	if (x != 0)
		neighborCells.push([x-1, y]);
		if (y != 0)
			neighborCells.push([x-1, y-1]);
		if (y != n)
			neighborCells.push([x-1, y+1]);
	if (x != m)
		neighborCells.push([x+1, y]);
		if (y != 0)
			neighborCells.push([x+1, y-1]);
		if (y != n)
			neighborCells.push([x+1, y+1]);
	if (y != 0)
		neighborCells.push([x, y-1]);
	if (y != n)
		neighborCells.push([x, y+1]);

	return neighborCells;
}

app.get('/nextgen', function(req, res) {
	var m = JSON.parse(req.query['M']);
	var n = JSON.parse(req.query['N']);
	var liveCells = req.query['liveCells'];

	var cells = {};
	liveCells.forEach(function(liveCell) {
		var x = JSON.parse(liveCell[0]);
		var y = JSON.parse(liveCell[1]);
		var location = [x, y];

		if (location in cells)
			cells[location].live = true;
		else
			cells[location] = {count:0, live:true};

		var neighbors = getNeighbors(x, y, m, n);
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
			var x = Number(key.split(',')[0]);
			var y = Number(key.split(',')[1]);
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