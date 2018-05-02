const jwt= require('jsonwebtoken');

module.exports = (req,res,next)=>{
	try{
		const decoded = jwt.verify(req.body.token,process.env.TOKEN_SECRET);
		req.userData=decoded;
			
	}catch(err){
		req.userData=null;
		res.status(401).json({
			message: "You're not logging in, please log in to continue"
		})
	}
	next();	
}