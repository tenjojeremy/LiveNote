import React from 'react';
import styled from 'styled-components'
import RecItemView from '../components/groups/Playback_ItemView.js';
import PlaybackOptions from '../components/groups/Playback_Options.js';
import NotePreview from '../components/groups/NotePreview.js';

//State
//import {bindActionCreators} from 'redux';

//define actions

class Playback extends React.Component {

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
		//Reactive Styles

		//Template
		return (
			<Wrapper>
				<ItemViewContainer>
					<RecItemView/>
				</ItemViewContainer>

				<OptionsContainer>
					<PlaybackOptions/>
				</OptionsContainer>

				<NotePreview/>
			</Wrapper>
		);
	}

}

//Styles
const Wrapper = styled.div `
	max-width: 600px;
	margin: 0 auto;
	padding: 10px;

 `;
const ItemViewContainer = styled.div `
${'' /* margin-top: 50px; */}
margin-bottom: 100px;
overflow-x: hidden;
 `;

const OptionsContainer = styled.div `
max-width: 600px;
${'' /* border: 3px solid red; */}
 margin: 0 auto;
 padding: 0;
 position: fixed;
 bottom: 0;
 left: 0;
 right: 0;
 width: 100%;
 height: 100px;
	 `;

//export default connect(mapStateToProps, mapDispatchToProps)(Playback);
export default Playback
