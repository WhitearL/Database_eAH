const AUCTION_ID_FIELD = "auctionID";
const GET_AUCTION_ROUTE = "/auctions/:auctionID";
const BUY_AUCTION_ROUTE = "/auctions/buy/:auctionID";

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

		var totalPriceGoldValue = 0;
		var totalPriceSilverValue = 0;

		if (isFloat(responseJSON.buyout)) {
			
			var totalGoldSilver = splitFloat((responseJSON.buyout).toFixed(2));
			
			totalPriceGoldValue = totalGoldSilver[0];
			totalPriceSilverValue = totalGoldSilver[1];
			
		} else if (isInt(responseJSON.buyout)) {
			unitPriceGoldValue = responseJSON.buyout;
			totalPriceGoldValue = responseJSON.buyout;
		}
		
		document.getElementById("itemname").value = responseJSON.item[0].name;
		document.getElementById("totalg").value = totalPriceGoldValue;
		document.getElementById("totals").value = totalPriceSilverValue;
		document.getElementById("qty").value = responseJSON.quantity;
		document.getElementById("btnBuy").value = responseJSON.auctionid;
	} catch (e) {
		document.getElementById("response").innerHTML = e;
	}

}

function makePurchaseRequest(auctionID) {
	
	// Reset output message.
    document.getElementById('message').innerHTML = "";

    // XML HTTP request object.
    var httpRequest = new XMLHttpRequest();

    // Read in data from form.
    var payload = JSON.stringify({ "auctionID" : auctionID });

	callbackAuctionID = auctionID;

    // Specify the callback function.
    httpRequest.addEventListener("load", handlePurchaseRequestResponse);

	var route = BUY_AUCTION_ROUTE.replace(":auctionID", auctionID);

    // Set header and send payload.
    httpRequest.open('POST', route);
    httpRequest.setRequestHeader('Content-Type', 'application/json');
    httpRequest.send(payload);
	
}

function handlePurchaseRequestResponse(response) {
	
	// Print response.
	document.getElementById("response").innerHTML = JSON.parse(response.target.responseText).message;
	
	// Remove line of auction
	if (response.target.status == 200) {		
		document.getElementById("trID" + callbackAuctionID).remove();
	}
	
}