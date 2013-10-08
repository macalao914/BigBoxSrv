var express = require('express'), http = require('http'), path = require('path');

var app = express();

var allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
	// intercept OPTIONS method
	if ('OPTIONS' == req.method) {
		res.send(200);
	} else {
		next();
	}
};
app.configure(function() {
	app.use(allowCrossDomain);
	app.set('port', process.env.PORT || 3412);
	//	app.set('views', __dirname + '/views');
	app.engine('html', require('ejs').renderFile);
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('your secret here'));
	app.use(express.session());
	app.use(app.router);
	//	app.use(require('stylus').middleware(__dirname + '/public'));
	//	app.use(express.static(path.join(__dirname, 'public')));

});

app.configure('development', function() {
	app.use(express.errorHandler());
});

app.use(express.bodyParser());

var users = [{
	id : 1,
	fname : 'Frasisco',
	lname : 'Dechoudens',
	address : 'abc',
	city : 'Humacao',
	state : 'PR',
	country : 'US',
	zipcode : '00980',
	phone : '7875555555',
	username : 'legendario',
	email : 'frankie@somewhere.who',
	password : 'qwe',
	question : 'question',
	answer : 'answer',
	bids : ['item1', 'item2', 'item3', 'item4'],
	sold : ['sold1', 'sold2', 'sold3', 'sold4'],
	cc : [{
		type : 'type1',
		num : '1234567890',
		exp : '11/18',
		cardName : 'FRANSISCO DECHOUDENS',
		billAddress : 'address1'
	}],
	isAdmin : true
}, {
	id : 2,
	fname : 'Derick',
	lname : 'Melendez',
	address : 'Carr 828 Km 2.2',
	city : 'Toa Alta',
	state : 'PR',
	country : 'US',
	zipcode : '00953-8130',
	phone : '7874008093',
	username : 'macalao914',
	email : 'macalao914@yahoo.com',
	password : '123',
	question : 'question',
	answer : 'answer',
	bids : ['item1', 'item2', 'item3', 'item4'],
	sold : ['sold1', 'sold2', 'sold3', 'sold4'],
	cc : [{
		type : 'type1',
		num : '1234567890',
		exp : '11/18',
		cardName : 'DERICK MELENDEZ MEDINA',
		billAddress : 'address1'
	}],
	isAdmin : false
}];

var cookie = new Array();
var item = require("./item.js");
var Item = item.Item;

var address = require("./address.js");
var Address = address.Address;

var creditcard = require("./creditcard.js");
var CreditCard = creditcard.CreditCard;

/*  Variables to store the data in the server  */

//defines the item list
var itemList = new Array(new Item("Star Wars", "Episode 1", "1999", "Two Jedi Knights escape a hostile blokade...", true, "22.00", "image/starwars.png", "19mm", "135mm", "14mm", "2.26oz", "Worldwide", "Puerto Rico", "new", true, "3", "Pepe Fulano", "3.00"), new Item("iPhone charger", "", "", "5V charger, is not too good but it's cheap", true, "2.00", "image/charger.png", "10mm", "5mm", "5mm", "2oz", "Worldwide", "Puerto Rico", "new", false, "", "Pepe Mengano", "4.00"), new Item("Megaman", "NT", "2003", "Join MegaMan and Battle Network pal, Lan, are in trouble again. It's only been a month since the evil WWW terrorist's attempts to...", true, "5.00", "image/megaman.png", "125mm", "8mm", "14mm", "2.26oz", "USA", "Puerto Rico", "used", true, "3", "Juanita Canales", "0.00"));

var itemNextId = 0;
for (var i = 0; i < itemList.length; ++i) {
	itemList[i].id = itemNextId++;
}

//defines the items in the cart
var cartList = new Array();

//defines the addresses saved by a user
var addressList = new Array();
var addressNextId = 0;

//defines the list of credit cards that a user has saved
var creditcardList = new Array();
var creditcardNextId = 0;

/*====================================================================================================================================
 REST Operations
 Idea: Data is created, read, updated, or deleted through a URL that
 identifies the resource to be created, read, updated, or deleted.
 The URL and any other input data is sent over standard HTTP requests.
 Mapping of HTTP with REST
 a) POST - Created a new object. (Database create operation)
 b) GET - Read an individual object, collection of object, or simple values (Database read Operation)
 c) PUT - Update an individual object, or collection  (Database update operation)
 d) DELETE - Remove an individual object, or collection (Database delete operation)
 ====================================================================================================================================*/

/*====================================================================================================================================
 REST Opertaion : HTTP GET
 ====================================================================================================================================*/
app.get('/BigBoxServer/items', function(req, res) {
	console.log("GET-itemS");
	var response = {
		"items" : itemList
	};
	res.json(response);
});

//Read all items in the cart
app.get('/BigBoxServer/cart', function(req, res) {
	console.log("GET-CART");
	var response = {
		"cart" : cartList
	};
	res.json(response);
});

//Read all the addresses that a user has saved
app.get('/BigBoxServer/addresses', function(req, res) {
	console.log("GET-ADDRESSES");
	var response = {
		"addresses" : addressList
	};
	res.json(response);
});

//Read all the credit card that a user has saved
app.get('/BigBoxServer/creditcards', function(req, res) {
	console.log("GET CREDIT CARDS");
	var response = {
		"creditcards" : creditcardList
	};
	res.json(response);
});

//Read a car based on its id
app.get('/BigBoxServer/items/:id', function(req, res) {
	var id = req.params.id;
	console.log("GET item: " + id);

	if ((id < 0) || (id >= itemNextId)) {
		// not found
		res.statusCode = 404;
		res.send("Item not found.");
	} else {
		var target = -1;
		for (var i = 0; i < itemList.length; ++i) {
			if (itemList[i].id == id) {
				target = i;
				break;
			}
		}
		if (target == -1) {
			res.statusCode = 404;
			res.send("Item not found.");
		} else {
			var response = {
				"item" : itemList[target]
			};
			res.json(response);
		}
	}
});

//Read an address based on its id
app.get('/BigBoxServer/addresses/:id', function(req, res) {
	var id = req.params.id;
	console.log("GET address: " + id);

	if ((id < 0) || (id >= addressNextId)) {
		// not found
		res.statusCode = 404;
		res.send("Address not found.");
	} else {
		var target = -1;
		for (var i = 0; i < addressList.length; ++i) {
			if (addressList[i].id == id) {
				target = i;
				break;
			}
		}
		if (target == -1) {
			res.statusCode = 404;
			res.send("Address not found.");
		} else {
			var response = {
				"address" : addressList[target]
			};
			res.json(response);
		}
	}
});

//Read a credit card based on its id
app.get('/BigBoxServer/creditcards/:id', function(req, res) {
	var id = req.params.id;
	console.log("GET credit card " + id);

	if ((id < 0) || (id >= creditcardNextId)) {
		// not found
		res.statusCode = 404;
		res.send("Credit Card not found.");
	} else {
		var target = -1;
		for (var i = 0; i < creditcardList.length; ++i) {
			if (creditcardList[i].id == id) {
				target = i;
				break;
			}
		}
		if (target == -1) {
			res.statusCode = 404;
			res.send("Credit Card not found.");
		} else {
			var response = {
				"creditcard" : creditcardList[target]
			};
			res.json(response);
		}
	}
});

//Verify if user a user is logged
app.get('/BigBoxServer/verify/', function(req, res) {

	// if user is not logged in, ask them to login
	console.log(cookie[0]);
	if (cookie[0] != undefined) {
		console.log("made it");
		if ( typeof cookie[0].username == 'undefined') {
			console.log("then here");
			res.send(401, "Please Login.");
		} else {
			console.log("or here");
			res.send(findByUsername(cookie[0].username));
		}
	} else
		res.send(200);
	//catch bug when reloading site after user is logged in
});

//User logout, back to home page
app.get('/BigBoxServer/logout', function(req, res) {
	// delete the session variable
	cookie.pop();
	res.send(200);

});

app.get('/BigBoxServer/account', function(req, res) {

	if (!isLoggedIn(cookie[0].username)) {
		res.send(401, "Please Login.");
	} else
		res.send(200);
});

/*====================================================================================================================================
REST Opertaion : HTTP POST
====================================================================================================================================*/
//Add an item to the cart
app.post('/BigBoxServer/cart', function(req, res) {
	console.log("POST");
	var itemToAdd = new Item(req.body.name, req.body.model, req.body.year, req.body.info, req.body.buyItNow, req.body.price, req.body.img, req.body.width, req.body.length, req.body.heigth, req.body.weigth, req.body.shipTo, req.body.shipFrom, req.body.condition, req.body.hasBid, req.body.bid, req.body.seller, req.body.shippingPrice);
	itemToAdd.id = req.body.id;
	console.log("Item to add: " + JSON.stringify(itemToAdd));
	cartList.push(itemToAdd);
	console.log("Item added. Length: " + cartList.length);
	res.json(true);
});

//Add a new address to the saved addresses
app.post('/BigBoxServer/addresses', function(req, res) {
	console.log("POST ADDRESS");

	if (!req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('street') || !req.body.hasOwnProperty('city') || !req.body.hasOwnProperty('state') || !req.body.hasOwnProperty('zip') || !req.body.hasOwnProperty('country') || !req.body.hasOwnProperty('phone')) {
		res.statusCode = 400;
		return res.send('Error: Missing fields for the item.');
	}

	var newAddress = new Address(req.body.name, req.body.street, req.body.city, req.body.state, req.body.zip, req.body.country, req.body.phone);
	console.log("New Address: " + JSON.stringify(newAddress));
	newAddress.id = addressNextId++;
	addressList.push(newAddress);
	res.json(true);
});

//Add a credit card to the saved list
app.post('/BigBoxServer/creditcards', function(req, res) {
	console.log("POST CREDIT CARD");

	if (!req.body.hasOwnProperty('cardnumber') || !req.body.hasOwnProperty('exp_month') || !req.body.hasOwnProperty('exp_year') || !req.body.hasOwnProperty('holder_name')) {
		res.statusCode = 400;
		return res.send('Error: Missing fields for the item.');
	}

	var newCreditCard = new CreditCard(req.body.cardnumber, req.body.exp_month, req.body.exp_year, req.body.holder_name);
	console.log("New Address: " + JSON.stringify(newCreditCard));
	newCreditCard.id = creditcardNextId++;
	creditcardList.push(newCreditCard);
	res.json(true);
});

//Login
app.post('/BigBoxServer/user', function(req, res) {
	// if the username is not submitted, give it a default of "Anonymous"
	user = findByUsername(req.body.username);
	// store the username as a session variable

	if (user.id != -1 && req.body.password == user.password) {
		req.session.username = user.username;
		cookie.push(req.session);
		res.send(200);
	} else
		res.send(401, "Incorect username or password.");
});

app.post('/BigBoxServer/register', function(req, res) {
	var temp = new Array(req.body.fname, req.body.lname, req.body.address, req.body.city, req.body.state, req.body.country, req.body.zipcode, req.body.phone, req.body.new_username, req.body.email, req.body.new_password, req.body.question, req.body.answer);
	console.log(temp.length);
	var val = isValid(temp, req.body.renter);
	if (val != "valid") {
		res.send(400, val);
	} else {

		adduser(temp);
		res.send(200);
	}

});
/*====================================================================================================================================
 REST Opertaion : HTTP PUT
 ====================================================================================================================================*/
app.put('/BigBoxServer/items/:id', function(req, res) {
	var id = req.params.id;

	console.log("PUT item: " + id);
	console.log(req.body);
	if ((id < 0) || (id >= itemNextId)) {
		// not found
		res.statusCode = 404;
		res.send("Item not found.");
	} else if (!req.body.hasOwnProperty('img') || !req.body.hasOwnProperty('info') || !req.body.hasOwnProperty('price')) {
		res.statusCode = 400;
		return res.send('Error: Missing fields for the item.');
	} else {
		var target = -1;
		for (var i = 0; i < itemList.length; ++i) {
			if (itemList[i].id == id) {
				target = i;
				break;
			}
		}
		if (target == -1) {
			res.statusCode = 404;
			res.send("Item not found.");
		} else {
			var theitem = itemList[target];
			theitem.bid = req.body.bid;
			theitem.name = req.body.name;
			theitem.model = req.body.model;
			theitem.year = req.body.year;
			theitem.info = req.body.info;
			theitem.buyItNow = req.body.buyItNow;
			theitem.price = req.body.price;
			theitem.img = req.body.img;
			theitem.dimension = " " + req.body.width + "x" + req.body.length + "x" + req.body.heigth;
			theitem.weigth = req.body.weigth;
			theitem.shipTo = req.body.shipTo;
			theitem.shipFrom = req.body.shipFrom;
			theitem.condition = req.body.condition;
			theitem.hasBid = req.body.hasBid;
			theitem.bid = req.body.bid;
			theitem.seller = req.body.seller;
			theitem.shippingPrice = req.body.shippingPrice;
			var response = {
				"item" : theitem
			};
			res.json(response);
		}
	}
});

/*====================================================================================================================================
 REST Opertaion : HTTP DELETE
 ====================================================================================================================================*/

/*====================================================================================================================================
 Support Functions
 ====================================================================================================================================*/

function findByUsername(username) {
	for (var i = 0, len = users.length; i < len; i++) {
		var user = users[i];
		if (user.username === username) {
			return user;
		}
	}
	return users[0];
}

function isLoggedIn(user) {
	if (user == undefined)
		return false;
	else
		return true;

};

function adduser(arr) {

	users = users.concat({
		id : users.length,
		fname : arr[0],
		lname : arr[1],
		address : arr[2],
		city : arr[3],
		state : arr[4],
		country : arr[5],
		zipcode : arr[6],
		phone : arr[7],
		username : arr[8],
		email : arr[9],
		password : arr[10],
		question : arr[11],
		answer : arr[12]
	});

	return users[users.length - 1];
};

function isValid(arr, renter) {

	for (var i = 0; i < arr.length; i++) {
		console.log(i);
		console.log(arr);
		if (arr[i].length == 0)
			return "Form is not complete.";
	};
	console.log("validating");

	if (arr[10] != renter)
		return "Passwords don't match.";
	console.log("users");

	console.log(users);

	for (var i = 0; i < users.length; i++) {
		if (arr[8] == users[i])
			return "Username " + arr[8] + " is already taken.";
		else if (arr[9] == users[i])
			return "Email " + arr[9] + " is already registerd.";
	};

	return "valid";
}

// Server starts running when listen is called.
app.listen(process.env.PORT || 3412);
console.log("server listening port:3412");
