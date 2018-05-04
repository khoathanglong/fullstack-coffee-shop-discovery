const GoogleStrategy = require('passport-google-token').Strategy;
const config=require('./config');

module.exports=(passport,db)=>{
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
		    image: profile._json.picture,
		    goingList:[]
	  	};
	};

	passport.use(new GoogleStrategy(config, 
			(accessToken, refreshToken, profile, cb) => {
		  		// Extract the minimal profile information we need from the profile object
		  		// provided by Google
		  		db.collection('users').findOne({id:profile.id},{_id:0},(err,user)=>{
		  			if (err) {console.log('strategy err: ',err)};
		  			if (!user){
		  				db.collection('users').insertOne(extractProfile(profile))
		  				cb(null, extractProfile(profile));
		  			}else{console.log('found user')
		  				cb(null, user);
		  			}
		  		})

			}
		)
	);


}
