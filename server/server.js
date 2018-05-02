const express=require('express'),
	request=require('request'),
	bodyParser=require('body-parser'),
	morgan=require('morgan'),
	app =express(),
	MongoClient=require('mongodb').MongoClient,
	url= 'mongodb://localhost:27017',
	assert=require('assert'),
	fetch=require('node-fetch'),
	cors=require('cors'),
	passport=require('passport'),
	google=require('./google-auth'),
	cache=require('apicache').middleware,
	verifyToken=require('./utils/verifyToken'),
	{ generateToken, sendToken } = require('./utils/token');


require('dotenv').config();//create variable environment	
app.use(cors())//modify to accept only some of clients later
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());	
app.use(passport.initialize());

MongoClient.connect(url,(err,client)=>{
	assert.equal(null,err);
	console.log('connected to the server');
	const db=client.db('kd-coffee-shop');//database name
	
	google(passport,db);

	app.get('/api/shops/:location',cache('5 minutes'),(req,res)=>{
		const location=JSON.parse(req.params.location);
		let url=`https://api.yelp.com/v3/businesses/search?term=coffee&limit=12&open_now=true`;
		if (typeof location==="object"){
			url+=`&latitude=${location[0]}&longitude=${location[1]}`
		}else{
			url+=`&location=${location}`
		};		
		fetch(url,{
			method:'get',
			headers:{
				Authorization: `Bearer ${process.env.CLIENT_API}`,
				'Content-Type':'application/json'
			}
		})
		.then(response=>response.json())
		.then(response=>{
			console.log(response)
			const data=response.businesses.map(data=>{
				return {
					name:data.name,
					id:data.id,
					image:data.image_url,
					location:data.location,
					phone:data.phone,
					rating:data.rating,
					url:data.url,
					going:0
				}
			});
			res.json(data)
		})
		.catch(err=>console.log(err))
	});

	app.get('/auth/google',passport.authenticate('google-token', {session: false}),(req,res,next)=>{
		//if google token is authenticated, then set req.auth={id:req.user.id} then create server token
		//then send it
		//if not authenticated, passport will send a 401
		req.auth={id:req.user.id};
		next()
	},generateToken,sendToken);

	app.post('/shops/:id',verifyToken,(req,res)=>{
		if (!req.userData) {
			return res.status(401).json("You should log in first");
		};
	});
})//outer
app.listen(process.env.PORT||3001, ()=>{
	console.log('app listening to port',process.env.PORT||3001)
})	