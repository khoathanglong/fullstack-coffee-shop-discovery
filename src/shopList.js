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
							<p style={{fontWeight:'bold'}}>{shop.name}{' '}
								{stars(shop.rating).map(()=>{
									return <i class="fa fa-star"></i>
								})}
							</p>
							<p>
								Address: {shop.location.address1} <br/>
								{shop.phone?<span>Tel: {shop.phone}</span>:null}
							</p>
								<Button bsStyle="success">
									Going 0
								</Button>{' '}
								
								
						</Thumbnail> 
					</Col>
				)
			})}
		</Masonry>
	)
}