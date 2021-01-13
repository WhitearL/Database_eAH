Joe,

	Please install the app by running the following.
		npm install
		npm init --y

	Run the app by running 'node app'

	Visit 'localhost:2020/' to access the app. You will need to sign up (Do not use any passwords you currently use). 
	The user auth is appropriately hashed but you can never be too careful.

	You should not have to change the .env file. The port is 2020 and the mongodb uri string points to my atlas cluster. Let me know if you cant get access.

	Below is a copy of my mongodb atlas connection string, should you run into any problems
	mongodb+srv://WhitearL:LpUUsA3YA9xShuM2@ahcluster.wlo2g.mongodb.net/AHDB?retryWrites=true&w=majority

NOTE: 
	When creating an auction, it is important to remember that the system only accepts valid World of Warcraft item ids.
	I have included a list of the accepted item ids that are in the database in 'Valid Item IDs.json' (Open it in Notepad++ or youll crash, there are a lot of them)
	Despite my best efforts, I couldnt find *all* the item ids, so please excuse any omissions.