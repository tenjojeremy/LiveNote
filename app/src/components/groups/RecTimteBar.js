import React from 'react';
import styled from 'styled-components'

//State
//import {bindActionCreators} from 'redux';
//import {connect} from 'react-redux';
//import {triggerAction} from '../state/actions/index';

//Set global state to prop
//define actions

class RecTimeBar extends React.Component {

	//initial state
	constructor(props) {
		super(props)
		this.state = {
			data: 'initial'
		}
	}

	//Methods

	render() {
		//Properties

		//Template
		return (
			<Wrapper></Wrapper>
		);
	}

}

//Style
const Wrapper = styled.div `

		             `;
//export default connect(mapStateToProps, mapDispatchToProps)(RecTimeBar);
export default RecTimeBar