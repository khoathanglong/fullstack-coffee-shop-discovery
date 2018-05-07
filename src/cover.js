import React from 'react'
import {FormControl,InputGroup,Button,ControlLabel,Row, Col} from 'react-bootstrap'

export default (props)=>{
	return (
		<div className="cover" >
			<div className="title">Discover the most popular Café</div>
			<Row className="inputGroup">
				<Col sm={5} smOffset={1} xs={12} >
					<form onSubmit={props.getCityName}>
						<InputGroup>
						 	<FormControl 
					          	type="text"
					           	placeholder="By City"
				          	/>
						 	<InputGroup.Addon style={{cursor:'pointer'}} onClick={props.getCityName}>
						 		<i className="fa fa-search"></i>
						 	</InputGroup.Addon>
						</InputGroup>
					</form>
				</Col>
				<Col sm={1} className="or">
					<span >
						Or
					</span>
				</Col>
				<Col sm={4} xs={12}>
					<Button bsStyle="success" onClick={props.getGeoLocation}>
						Your Location{' '}
						<i className="fa fa-map-marker" aria-hidden="true"></i>
					</Button>
				</Col>
			</Row>	 
        </div>
	)
}