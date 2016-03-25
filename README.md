# Next Generation

A Node.js app using [Express 4](http://expressjs.com/) that provides an API that will return the next generation of grid cells for a game described below.

The game consists of an MxN grid.  The grid is divided into cells. Each cell is either “on” or “off”.  

A client animates the grid by displaying successive “generations.” The rules for calculating generation G + 1 given generation G are as follows:

Count the number of 'on' cells surrounding each cell on the board. If the number of 'on' cells is less than two, that cell is 'off' for the next generation. If the number of 'on' cells is two, that cell stays the same. If the number of 'on' cells is three, the cell becomes 'on'. If the number of cells is greater than three, the cell becomes 'off'.

## Running Locally

```
$ git clone git@github.com:creviera/test.git # or clone your own fork
$ cd test
$ npm install
$ npm start
```

The app should now be running on [localhost:5000](http://localhost:5000/). Click the button to get the next cell generation for the input: [[2,1],[2,2],[2,3]]

## Demo hosted in Heroku

`https://creviera.herokuapp.com/`

## API

URL: 
`http://<hostname>/nextgen`

e.g.
```
var liveCells = [[2,1],[2,2],[2,3]];
var data = {
    'M': 3,
    'N': 3, 
    'liveCells' : liveCells
};
$.ajax({
    url: 'nextgen',
    jsonp: 'callback',
    dataType: 'jsonp',
    data: data,
    success: function(response) {
      drawGeneration(response);
    }
});

```

## Documentation used when working on this project

- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
- [JQuery - asynchronous HTTP (Ajax) request](http://api.jquery.com/jquery.ajax/)
- [Node.js body parsing](https://github.com/expressjs/body-parser)
