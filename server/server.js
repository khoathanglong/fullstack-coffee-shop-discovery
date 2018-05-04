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
	sameDate=require('./utils/compareDate'),
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
			db.collection('user').find({},{goingList:1,_id:0})
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
		req.auth={id:req.user.id,name:req.user.displayName};
		next()
	},generateToken,sendToken);

	app.put('/users/shops',verifyToken,(req,res)=>{
		console.log(req.body)
		db.collection('users').updateOne(
			{id:req.userData.id},
			{$addToSet:{goingList:req.body.shop}}
			//expect client send an object including date and restaurant ID in the body
		).then(()=>{
			res.json('update successfully')
		})
		
	});

	app.delete('/users/shops',verifyToken,(req,res)=>{
		db.collection('users').findOne({id:req.userData.id},(err,user)=>{
			let queryIndex=user.goingList.findIndex(el=>{
					return	el.id===req.body.shop.id&&sameDate(el.goingDate,req.body.shop.deletingDate)
				});
			if(queryIndex>-1){
				db.collection('users').updateOne(
					{id:req.userData.id},
					{
						$pull:{goingList:{goingDate:user.goingList[queryIndex].goingDate}}
					}
				)
				res.json('remove shop going successfully');
			}else{
				res.json('no information found')
			}
		});
	});


})//outer
app.listen(process.env.PORT||3001, ()=>{
	console.log('app listening to port',process.env.PORT||3001)
})	