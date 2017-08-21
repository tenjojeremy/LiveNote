import React from 'react';
import styled from 'styled-components'
import RecItemView from '../components/groups/RecItemView.js';
// import RecTimteBar from '../components/groups/RecTimteBar.js';
import RecOptions from '../components/groups/RecOptions.js';
import NewNote from '../components/groups/NewNote.js';
import NewNoteImage from '../components/groups/NewNote_Image.js';
import NotePreview from '../components/groups/NotePreview.js';

class Recording extends React.Component {

	//Methods

	render() {

		//Template
		return (
			<Wrapper>

				<ItemViewContainer>
					<RecItemView/>
				</ItemViewContainer>

				{/* <TimeBarContainer>
					<RecTimteBar/>
				</TimeBarContainer> */}

				<OptionsContainer>
					<RecOptions/>
				</OptionsContainer>

				<NewNote/>
				<NewNoteImage/>
				<NotePreview/>

			</Wrapper>
		);
	}

}

//Styles
const Wrapper = styled.div `
	max-width: 600px;
	margin: auto;
	padding: 10px;

 `;
const ItemViewContainer = styled.div `
margin-bottom: 105px;
overflow-x: hidden;
 `;
// const TimeBarContainer = styled.div `
// `;
const OptionsContainer = styled.div `
 background: #0F2331;
position: fixed;
bottom: 0;
height: 104px;
max-width: 600px;
width: 100%;
left: 0;
right: 0;
margin: auto;
	 `;

export default Recording;
