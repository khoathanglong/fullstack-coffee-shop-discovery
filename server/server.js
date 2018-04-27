const express=require('express'),
	request=require('request'),
	bodyParser=require('body-parser'),
	morgan=require('morgan'),
	app =express(),
	MongoClient=require('mongodb').MongoClient,
	url= 'mongodb://localhost:27017',
	assert=require('assert'),
	fetch=require('node-fetch'),
	cors=require('cors')

require('dotenv').config();//create variable environment	
app.use(cors())//modify to accept only some of clients later
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());	




MongoClient.connect(url,(err,client)=>{
	assert.equal(null,err);
	console.log('connected to the server');

	app.get('/api/',(req,res)=>{
		fetch('https://api.yelp.com/v3/businesses/search?term=coffee&location=paris&limit=24',{
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
					rating:data.rating
				}
			});
			res.json(data)
		})
	})
	


})//outer





app.listen(process.env.PORT||3001, ()=>{
	console.log('app listening to port',process.env.PORT||3001)
})	