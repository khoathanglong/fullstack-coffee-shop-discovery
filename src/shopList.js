import React from 'react';
import {Col, Row, Thumbnail,Button} from 'react-bootstrap';
import Masonry from 'react-masonry-component';


export default (props)=>{
	function stars(n){
		let star=[];
		for(let i=0;i<n;i++){
			star.push(i)
		}
		return star
	}
	return (
		<Masonry options={{transitionDuration: 0}}>
			{props.shoplist.map((shop,index)=>{
				return (
					<Col xs={12} sm={6} md={4} lg={3} key={index}>
						<Thumbnail src={shop.image} responsive>
							<a href={shop.url} target="_blank">
								<p style={{fontWeight:'bold'}}>{shop.name}{' '}
									{stars(shop.rating).map((e,i)=>{
										return <i className="fa fa-star" key={i}></i>
									})}
								</p>
								<p>
									Address: {shop.location} <br/>
									{shop.phone?<span>Tel: {shop.phone}</span>:null}
								</p>
							</a>	
								<Button bsStyle="success" onClick={()=>props.handleGoing(index,shop.id)}>
									Going {shop.going}
								</Button>{' '}
						</Thumbnail> 
					</Col>
				)
			})}
		</Masonry>
	)
}