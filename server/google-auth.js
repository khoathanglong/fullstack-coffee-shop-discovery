const GoogleStrategy = require('passport-google-token').Strategy;
const config=require('./config');
console.log(config)
module.exports=(passport)=>{
	passport.serializeUser((user, cb) => {
  		cb(null, user);
	});
	passport.deserializeUser((obj, cb) => {
  		cb(null, obj);
	});

	const extractProfile = (profile) => {
	    return {
		    id: profile.id,
		    displayName: profile.displayName,
		    image: profile._raw.picture
	  	};
	};

	passport.use(new GoogleStrategy(config, 
			(accessToken, refreshToken, profile, cb) => {
		  		// Extract the minimal profile information we need from the profile object
		  		// provided by Google
		  		if(!accessToken){
		  			console.log('wrong token')
		  		}
		  		console.log('accessToken',accessToken)
		  		console.log('refreshToken',refreshToken)
		  		console.log(profile); 
	  			cb(null, extractProfile(profile));
			}
		)
	);


}
