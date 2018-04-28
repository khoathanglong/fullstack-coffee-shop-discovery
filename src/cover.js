import React from 'react'
import {FormControl,InputGroup,Button,ControlLabel,Row, Col} from 'react-bootstrap'

export default ()=>{
	return (
		<div className="cover" >
		<div className="title">Discover the most popular Café</div>
			<Row className="inputGroup">
				<Col sm={5} smOffset={2} xs={12} >
					<InputGroup>
					 	<FormControl 
				          	type="text"
				           	placeholder="By City"
			          	/>
					 	<InputGroup.Addon>
					 		<i class="fa fa-search"></i>
					 	</InputGroup.Addon>
					</InputGroup>
				</Col>
				<Col sm={1} className="<or></or>">
					<span >
						Or
					</span>
				</Col>
				<Col sm={4} xs={12} >
					<Button bsStyle="success">Your Location{' '}
						<i class="fa fa-map-marker" aria-hidden="true"></i>
					</Button>
				</Col>
			</Row>	 
        </div>
	)
}