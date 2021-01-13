const AUCTION_ID_FIELD = "auctionID";
const GET_AUCTION_ROUTE = "/auctions/:auctionID";
const DELETE_AUCTION_ROUTE = "/auctions/delete/:auctionID";
const CREATE_AUCTION_ROUTE = "/auctions/create/";
const EDIT_AUCTION_ROUTE = "/auctions/edit/:auctionID";
const WOWHEAD_URL = "https://classic.wowhead.com/";

var callbackAuctionID = 0;

// Split the decimal value on the decimal. 
// The value before is the gold, and the value after is the silver.
// 100 Silver = 1 Gold
function splitFloat(floatValue) {
	var splitFloatArr = floatValue.toString().split('.');
	
	if (splitFloatArr[1].toString()[0] == "0") {
		splitFloatArr[1] = parseInt(splitFloatArr[1].toString().replace("0", ""));
	}
	
	return splitFloatArr;
}

function joinFloat(goldValue, silverValue) {
	
	var buyoutFloat = 0.0;
	
	if (silverValue < 10 && silverValue.toString().length == 1) {
		buyoutFloat = parseFloat(goldValue + "." + "0" + silverValue);
	} else {
		buyoutFloat = parseFloat(goldValue + "." + silverValue);
	}
	
	return buyoutFloat;
}

function isInt(number){
    return Number(number) === number && number % 1 === 0;
}

function isFloat(number){
    return Number(number) === number && number % 1 !== 0;
}

function getAuction(auctionID) {
	
	// Reset output message.
    document.getElementById('message').innerHTML = "";

    // XML HTTP request object.
    var httpRequest = new XMLHttpRequest();

    // Read in data from form.
    var payload = JSON.stringify({ "auctionID" : auctionID });

    // Specify the callback function.
    httpRequest.addEventListener("load", handleGetAuctionResponse);

	var route = GET_AUCTION_ROUTE.replace(":auctionID", auctionID);

    // Set header and send payload.
    httpRequest.open('GET', route);
    httpRequest.setRequestHeader('Content-Type', 'application/json');
    httpRequest.send(payload);
	
}

function handleGetAuctionResponse(response) {

	try {
		var responseText = response.target.responseText;
		var responseJSON = JSON.parse(responseText);

	} catch (e) {
		document.getElementById("response") = response.target.responseText;
	}

}

function makeDeleteRequest(auctionID) {
	
	// Reset output message.
    document.getElementById('message').innerHTML = "";

    // XML HTTP request object.
    var httpRequest = new XMLHttpRequest();

    // Read in data from form.
    var payload = JSON.stringify({ "auctionID" : auctionID });

	callbackAuctionID = auctionID;

    // Specify the callback function.
    httpRequest.addEventListener("load", handleDeleteRequestResponse);

	var route = DELETE_AUCTION_ROUTE.replace(":auctionID", auctionID);

    // Set header and send payload.
    httpRequest.open('POST', route);
    httpRequest.setRequestHeader('Content-Type', 'application/json');
    httpRequest.send(payload);
	
}

function handleDeleteRequestResponse(response) {
	
	// Print response.
	document.getElementById("response").innerHTML = JSON.parse(response.target.responseText).message;
	
	// Remove line of auction
	if (response.target.status == 200) {		
		document.getElementById("trID" + callbackAuctionID).remove();
	} 
}

function createAuction() {
	
	try {
		// Reset output message.
		document.getElementById('message').innerHTML = "";

		// XML HTTP request object.
		var httpRequest = new XMLHttpRequest();

		var playerid = parseInt(document.getElementById("playerid").value);
		var itemid = parseInt(document.getElementById("itemid").value);
		var quantity = parseInt(document.getElementById("qty").value);		
		var buyoutg = parseInt(document.getElementById("buyoutg").value);
		var buyouts = parseInt(document.getElementById("buyouts").value);
		
		var values = [playerid, itemid, quantity, buyoutg, buyouts];
		
		var valid = true;
		var intRegex = new RegExp('^[0-9]\d*$');

		if (buyouts >= 100) {
			buyouts = 99;
		} else if (buyouts < 0) {
			buyouts = 0;
		} 

		var i;
		for (i = 0; i < values.length; i++) {
			if (!Number.isInteger(values[i])) {
				valid = false;
			}
		}
			
		if (valid) {
			var buyout = joinFloat(buyoutg, buyouts);
			// Read in data from form.
			var payload = JSON.stringify(
				{ 
					"playerid" : playerid,
					"itemid" : itemid,
					"quantity" : quantity,
					"buyout" : buyout
				}
			);

			// Specify the callback function.
			httpRequest.addEventListener("load", handleCreateAuctionResponse);

			// Set header and send payload.
			httpRequest.open('POST', CREATE_AUCTION_ROUTE);
			httpRequest.setRequestHeader('Content-Type', 'application/json');
			httpRequest.send(payload);
		} else {
			alert("Invalid number formats entered. Numeric fields must only have numbers.");
		}
	} catch (e) {
		console.error(e);
		alert("Invalid number formats entered. Numeric fields must only have numbers.");
	}
	
}

function handleCreateAuctionResponse(response) {

	alert(JSON.parse(response.target.responseText).message);

	window.location.reload(); 

}

function editAuction() {
	try {

		// XML HTTP request object.
		var httpRequest = new XMLHttpRequest();

		var auctionid = parseInt(document.getElementById("auctionid").value);
		var playerid = parseInt(document.getElementById("playerid").value);
		var itemid = parseInt(document.getElementById("itemid").value);
		var quantity = parseInt(document.getElementById("qty").value);		
		var buyoutg = parseInt(document.getElementById("buyoutg").value);
		var buyouts = parseInt(document.getElementById("buyouts").value);
		
		var values = [auctionid, playerid, itemid, quantity, buyoutg, buyouts];
		
		var valid = true;
		var intRegex = new RegExp('^[0-9]\d*$');

		if (buyouts >= 100) {
			buyouts = 99;
		} else if (buyouts < 0) {
			buyouts = 0;
		} 

		var i;
		for (i = 0; i < values.length; i++) {
			if (!Number.isInteger(values[i])) {
				valid = false;
			}
		}
			
		if (valid) {
			var buyout = joinFloat(buyoutg, buyouts);
			// Read in data from form.
			var payload = JSON.stringify(
				{
					"auctionid" : auctionid,
					"playerid" : playerid,
					"itemid" : itemid,
					"quantity" : quantity,
					"buyout" : buyout
				}
			);

			// Specify the callback function.
			httpRequest.addEventListener("load", handleEditAuctionResponse);

			var route = EDIT_AUCTION_ROUTE.replace(":auctionID", auctionid);

			// Set header and send payload.
			httpRequest.open('POST', route);
			httpRequest.setRequestHeader('Content-Type', 'application/json');
			httpRequest.send(payload);
		} else {
			alert("Invalid number formats entered. Numeric fields must only have numbers.");
		}
	} catch (e) {
		console.error(e);
		alert("Invalid number formats entered. Numeric fields must only have numbers.");
	}
}

function handleEditAuctionResponse(response) {
	
	document.getElementById("response").innerHTML = JSON.parse(response.target.responseText).message;
	
}