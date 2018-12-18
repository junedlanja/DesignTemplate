var express = require('express'),
    path = require('path'),
    app = express();

//set the port
app.set('port', 3000);

//tell express that we want to use the public folder
//for our static assets
app.use(express.static(path.join(__dirname, '/public')));

// Listen for requests
var server = app.listen(app.get('port'), function() {
    console.log('The server is running on http://localhost:' + app.get('port'));
});