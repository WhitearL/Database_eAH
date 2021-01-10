const AUCTION_ID_FIELD = "auctionID";
const GET_AUCTION_ROUTE = "/auctions/:auctionID";

// Split the decimal value on the decimal. 
// The value before is the gold, and the value after is the silver.
// 100 Silver = 1 Gold
function splitFloat(floatValue) {
	return (float).toFixed(2).toString().split('.');
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
    var payload = JSON.stringify({ AUCTION_ID_FIELD : auctionID });

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

		var unitPriceGoldValue = 0;
		var unitPriceSilverValue = 0;

		var totalPrice = responseJSON.buyout * responseJSON.quantity;

		var totalPriceGoldValue = 0;
		var totalPriceSilverValue = 0;

		if (isFloat(responseJSON.buyout) && isFloat(totalPrice)) {	
			
			var unitPriceGoldSilver = splitFloat(responseJSON.buyout);
			
			unitPriceGoldValue = unitPriceGoldSilver[0];
			unitPriceSilverValue = unitPriceGoldSilver[1];
			
			var totalGoldSilver = splitFloat(totalPrice);
			
			totalPriceGoldValue = totalGoldSilver[0];
			totalPriceSilverValue = totalGoldSilver[1];
			
		} else if (isInt(responseJSON.buyout) && isInt(totalPrice)) {
			unitPriceGoldValue = responseJSON.buyout;
			totalPriceGoldValue = responseJSON.buyout;
		}
		
		document.getElementById("unitpriceg").value = unitPriceGoldValue;
		document.getElementById("unitprices").value = unitPriceSilverValue;
		document.getElementById("itemname").value = responseJSON.item[0].name;
		document.getElementById("totalg").value = totalPriceGoldValue;
		document.getElementById("totals").value = totalPriceSilverValue;
		document.getElementById("qty").value = responseJSON.quantity;
		document.getElementById("btnBuy").value = responseJSON.auctionid;
	} catch (e) {
		document.getElementById("response") = response.target.responseText;
	}

}

function makePurchaseRequest(auctionID) {
}