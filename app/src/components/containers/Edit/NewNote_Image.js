import React from 'react';
import styled from 'styled-components'
import Close_Icon from '../../../images/icons/close.svg';
import Button from '../../global/Button.js';

//State
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Toggle_NewNote_Image, Insert_Item} from '../../../state/actions/index';

//Set global state to prop
function mapStateToProps(state) {
	return {status: state.NewNoteToggleImage, time: state.CurrentTime}
}
//define actions
function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		Toggle_NewNote_Image,
		Insert_Item
	}, dispatch)
}
class NewNote_Image extends React.Component {

	//initial state
	constructor(props) {
		super(props)
		this.state = {
			display: props.display,
			title: '',
			desc: ''
		}
	}

	//Methods
	handleTitle = (e) => {
		// console.log(e.target.value);
		this.setState({title: e.target.value})
	}
	handleDesc = (e) => {
		// console.log(e.target.value);
		this.setState({desc: e.target.value})
	}
	handleSubmit = (e) => {
		e.preventDefault();

		//Create new object
		let item = {};

		item.time = this.props.time.time;
		item.title = this.state.title;
		item.desc = this.state.desc;
		item.image = '';
		item.timeSeconds = this.props.time.timeSeconds;

		//Get image info
		var preview = document.querySelector('#PreviewImage');
		var reader = new FileReader();
		reader.addEventListener("load", () => {
			preview.src = reader.result;
		}, false);

		// console.log(preview.src);

		item.image = preview.src;

		preview.src = '';

		console.log(item);
		//Insert Item
		this.props.Toggle_NewNote_Image('none');
		this.props.Insert_Item(item);

		//reset vlaues
		this.setState({title: ""});
		this.setState({desc: ""});

	}
	hide = () => {
		this.props.Toggle_NewNote_Image('none');
	}
	render() {
		//Properties

		//Template
		return (
			<Wrapper onSubmit={this.handleSubmit} display={this.props.status}>

				<Top>
					<CloseIcon onClick={this.hide} src={Close_Icon}/>
					<Header>New Comment</Header>
				</Top>

				<Title autoFocus placeholder="Title" type="text" value={this.state.title} onChange={this.handleTitle}/>
				<ImgPreview id="PreviewImage" src="" alt="Loading..."/>

				<Comment placeholder="Write comment..." value={this.state.desc} onChange={this.handleDesc}/>

				<ButtonCon>
					<Button type="submit" color="#42EA9C" text="Add"/>
				</ButtonCon>

			</Wrapper>
		);
	}

}

//Style
const Wrapper = styled.form `
background: white;
z-index: 3;
position: fixed;
overflow-y: scroll;
overflow-x: hidden;
display: ${props => props.display === 'none'
	? 'none'
	: 'grid'};
grid-template-rows: 30px 30px auto 1fr 80px;
height: calc(100% - 130px);
width: 100%;
color: #212121;
padding-top: 10px;
top: 0;
left: 0;
grid-row-gap: 10px;
@media (max-height: 500px) {
    grid-template-rows: 30px 30px auto 100px 80px;
  }
	@media (max-height: 382px) {
	height: 100%;
	 }
		   `;
const Header = styled.h2 `
font-size: 16px;
margin: 0;
			  `;
const CloseIcon = styled.img `
width: 17px;
top: 15px;
right: 15px;
cursor: pointer;
float: right;
margin-right: 10px;
			  `;
const Top = styled.div `
text-align: center;
font-size: 20px;
			  `;
const ImgPreview = styled.img `
	max-width: 100%;
	display: block;
	margin: 0 auto;
				 `;
const Title = styled.input `
&:focus {
outline: none;
}
border:none
textDecoration: none;
border-color: transparent;
border-width:0px;
padding-left: 10px;
font-size: 17px;
padding-right: 10px;
margin-bottom: 10px;
font-weight: bold;
				 `;
const Comment = styled.textarea `
&:focus {
outline: none;
}
border:none
textDecoration: none;
border-color: transparent;
border-width:0px;
font-size: 15px;
margin-top: 10px;
padding-bottom: 50px;
				 `;
const ButtonCon = styled.div `
	width: 200px;
	display: block;
	margin: auto;
	padding-top: 10px;
	padding-bottom: 20px;
				 `;
export default connect(mapStateToProps, mapDispatchToProps)(NewNote_Image);
