const USERNAME_FIELD = "username";
const PASSWORD_FIELD = "password";
const LOGIN_ROUTE = "/login";

function attemptLogin() {
    // Reset output message.
    document.getElementById('message').innerHTML = "";

    // XML HTTP request object.
    var httpRequest = new XMLHttpRequest();

    // Read in data from form.
    var inputUsername = document.getElementById(USERNAME_FIELD).value;
    var inputPassword = document.getElementById(PASSWORD_FIELD).value;
    var payload = JSON.stringify(
        {
            "username": inputUsername,
            "password": inputPassword
        }
    );

    // Specify the callback function.
    httpRequest.addEventListener("load", handleResponse);

    // Set header and send payload.
    httpRequest.open('POST', LOGIN_ROUTE);
    httpRequest.setRequestHeader('Content-Type', 'application/json');
    httpRequest.send(payload);
}

// Callback function for logon requests.
function handleResponse(response) {
	
	// Login and redirect if valid.
	if (response.target.status == 200) {
		window.location.replace("/");
	} else {
		// Print response.
		document.getElementById("message").innerHTML = JSON.parse(response.target.responseText).message;
	}
	
}