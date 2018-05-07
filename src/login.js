import React from 'react';
import { GoogleLogin } from 'react-google-login';
import {Modal} from 'react-bootstrap'

export default (props)=>{
	return (
		<Modal show={props.showLogInModal} onHide={props.handleLogInPanel}>
			<Modal.Header closeButton>
				<Modal.Title>Please log in to process</Modal.Title>
			</Modal.Header>
			<Modal.Body style={{textAlign:'center'}}>
				<GoogleLogin
				clientId='643471830607-bq7l1emcnbekj9938fhclm5ionovl6n0.apps.googleusercontent.com'
				buttonText="Log in with google"
				onSuccess={props.responseGoogle}
				onFailure={props.responseGoogle}
				/>
			</Modal.Body>
		</Modal>
		
	)
}