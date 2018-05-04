const jwt =require('jsonwebtoken');

const createToken =(auth)=>{
	return jwt.sign({
		id:auth.id,
		name:auth.name
	},
	process.env.TOKEN_SECRET,
	{
		expiresIn:60*60
	})
};

module.exports={
	generateToken:function(req,res,next){
		req.token=createToken(req.auth);
		next()
	},
	sendToken:function(req,res){
		res.status(200)
			.json({token:req.token,...req.auth})
	}
}