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
	google=require('./google-auth');



google(passport);
require('dotenv').config();//create variable environment	
app.use(cors())//modify to accept only some of clients later
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());	
app.use(passport.initialize());



MongoClient.connect(url,(err,client)=>{
	assert.equal(null,err);
	console.log('connected to the server');

	app.get('/api/:location',(req,res)=>{
		const location=JSON.parse(req.params.location);
		let url=`https://api.yelp.com/v3/businesses/search?term=coffee&limit=24&open_now=true`;
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
	});

	app.get('/auth/google',passport.authenticate('google-token'),(req,res)=>{
		console.log(req.user)
	});

	app.get('/hello',passport.authenticate('google-token'),(req,res)=>{
		res.json('hello')
	});

})//outer
app.listen(process.env.PORT||3001, ()=>{
	console.log('app listening to port',process.env.PORT||3001)
})	