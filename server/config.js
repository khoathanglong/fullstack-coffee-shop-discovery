require('dotenv').config();//create variable environment

module.exports={
	clientID: process.env.GOOGLE_ID,
	clientSecret: process.env.GOOGLE_SECRET,
}
