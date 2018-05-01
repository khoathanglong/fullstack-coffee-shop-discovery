import React from 'react';
import { GoogleLogin } from 'react-google-login';

export default (props)=>{
	return (
		<GoogleLogin
			clientId='643471830607-bq7l1emcnbekj9938fhclm5ionovl6n0.apps.googleusercontent.com'
			buttonText="Log in with google"
			onSuccess={props.responseGoogle}
			onFailure={props.responseGoogle}
		/>
	)
}