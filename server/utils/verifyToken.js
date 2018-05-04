const jwt= require('jsonwebtoken');

module.exports = (req,res,next)=>{
	try{
		const decoded = jwt.verify(req.headers.token,process.env.TOKEN_SECRET);
		req.userData=decoded;
		console.log(req.userData)
		next();
	}catch(err){
		req.userData=null;
		res.json({
			message: "You're not logging in, please log in to continue"
		})
	}		
}