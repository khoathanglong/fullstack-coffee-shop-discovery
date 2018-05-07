import React from 'react';
import {Navbar,Nav,NavItem} from 'react-bootstrap';

export default (props)=>{
	return (
		<Navbar inverse fixedTop>
			<Navbar.Header >
				<Navbar.Brand>
					<a href="">Café Discovery</a>
				</Navbar.Brand>
			</Navbar.Header>
			{!props.user?
				<Nav pullRight>
					<NavItem onClick={props.handleLogInPanel} >
						Log In
					</NavItem>
				</Nav>:
				<Nav pullRight>
					<NavItem>
						{props.user.name}
					</NavItem>
					<NavItem onClick={props.handleLogOut} >
						Log Out
					</NavItem>
				</Nav>
			}
		</Navbar>
	)
}