import React from 'react'
import {FormControl,InputGroup,Button} from 'react-bootstrap'

export default ()=>{
	return (
		<div className="cover" >
			<div>
				<InputGroup>
				 	<FormControl 
			          	type="text"
			           	placeholder="City Name"
		          	/>
				 	<InputGroup.Addon>
				 		<i class="fa fa-search"></i>
				 	</InputGroup.Addon>
				</InputGroup><br/>
				<span style={{color:'white',fontSize:'2em'}}>Or</span><br/><br/>
				<Button bsStyle="success">Get your location{' '}
					<i class="fa fa-map-marker" aria-hidden="true"></i>
				</Button>
			</div>
			 
        </div>
	)
}