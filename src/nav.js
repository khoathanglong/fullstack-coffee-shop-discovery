import React from 'react';
import {Navbar,Nav,NavItem,NavDropdown ,MenuItem } from 'react-bootstrap';

export default (props)=>{
	return (
		<Navbar inverse fixedTop collapseOnSelect>
			<Navbar.Header >
				<Navbar.Brand>
					<a href="">Café Discovery</a>
				</Navbar.Brand>
				<Navbar.Toggle />
			</Navbar.Header>
			<Navbar.Collapse>
			{!props.user?
				<Nav pullRight>
					<NavItem eventKey={1} onClick={props.handleLogInPanel} >
						Log In
					</NavItem>
				</Nav>:
				<Nav pullRight>
					<NavItem eventKey={2}>
						{props.user.name}
					</NavItem>
					<NavDropdown eventKey={3} title="View" id="basic-nav-dropdown">
						<MenuItem eventKey={3.1} onClick={props.handleViewAllShops}>
							All Cafes
						</MenuItem> 
						<MenuItem divider />
						<MenuItem eventKey={3.2} onClick={props.handleUserShops}>
							My Choice
						</MenuItem> 
					</NavDropdown>
					<NavItem onClick={props.handleLogOut} eventKey={4}>
						Log Out
					</NavItem>
				</Nav>
			}
			</Navbar.Collapse>
		</Navbar>
	)
}