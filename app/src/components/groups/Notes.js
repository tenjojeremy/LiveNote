import React from 'react';
// import File from '../File_link.js';
import File from '../File_link_2.js';
import firebase from 'firebase';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Set_Playback_Id, Toggle_OptinsMenuHideFile, Show_Snackbar, Set_Snackbar_Name} from '../../state/actions/index';
import styled, {keyframes} from 'styled-components'
import Rename_img from '../../images/icons/rename.svg';
import Remove_img from '../../images/icons/rubbish-bin.svg';
import Close_Icon from '../../images/icons/close.svg';

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		Set_Playback_Id,
		Toggle_OptinsMenuHideFile,
		Show_Snackbar,
		Set_Snackbar_Name
	}, dispatch)
}

function mapStateToProps(state) {
	return {options: state.OtionsMenu_ToggleFile, fileID: state.File_Delete_ID, folderName: state.FileSelection_Rename}
}
class Notes extends React.Component {

	//initial state
	constructor(props) {
		super(props)
		this.state = {
			list: []
		}
	}

	//Methods
	componentWillMount() {
		this.fetchData()
	}

	 fetchData = () => {
			let userId = firebase.auth().currentUser.uid;
			let array = [];

			return firebase.database().ref('/users/' + userId + '/masterNotes').orderByChild('folderID').equalTo('Root').once('value').then((snap) => {
				let list = {},
					snapValue = snap.val();
				// console.log(snapValue);

				for (var prop in snapValue) {
					// console.log(snapValue[prop]);
					list.id = prop;
					list.dateAdded = snapValue[prop].dateAdded;
					list.dateAddedSort = snapValue[prop].dateAddedSort;
					list.folderID = snapValue[prop].folderID;
					list.folderName = snapValue[prop].folderName;
					list.name = snapValue[prop].name;

					// console.log(list);
					array.push(list);
					list = {};
				}
				// console.log(array);
				this.setState({list: array});
			});
	  }

	// openPlayback = (e) => {
	// 	this.props.Set_Playback_Id(e);
	// 	this.props.history.push(`/playback`);
	// }

	handleCloseRename = (e) => {
		this.setState({renameInput: false});
		// this.setState({title: ''});
		e.preventDefault();

	};
	hideOptions = () => {
		this.props.Toggle_OptinsMenuHideFile();
	}

	removeFolder = () => {
		//remove folder
		// console.log(this.props.folderID);
		firebase.database().ref(`users/${firebase.auth().currentUser.uid}/masterNotes/${this.props.fileID}`).remove();
		this.fetchData();
		this.props.Toggle_OptinsMenuHideFile();
		this.props.Set_Snackbar_Name('File Deleted');
		this.props.Show_Snackbar();

	}

	renameFolder = () => {
		//show rename input
		this.props.Toggle_OptinsMenuHideFile();
		this.setState({renameInput: true});

	}

	render() {
		//Properties
		let list = this.state.list.map((item, i) => <span key={item.id} ><File key={item.id} id={item.id} width="auto" name={item.name}/></span>);

		//Style
		const Wrapper = styled.div `
		margin-top: 15px;
padding-bottom: 90px;
	  `;
		const Title = styled.p `
	 margin-top: 5px;
	  `;
		const Container = styled.div `
	 display: grid;
	 grid-template-columns: 1fr 1fr;
	 grid-column-gap: 10px;
	 grid-row-gap: 10px;
	 `;

		const OptionsMenuWrapper = styled.form `
	 display: ${props => this.props.options
			? 'block'
			: 'none'};
	 position: fixed;
	 background: rgba(0, 0, 0, 0.73);
	 height: 100%;
	 width: 100%;
	 top: 0;
	 left: 0;
	 z-index: 20;
	 `;

		const rotate360 = keyframes `
			from {
				bottom: -150px;
			}

			to {
				bottom: 0;
			}
		 `;
		const OptionsMenuInner = styled.div `
	 position: fixed;
	 background: white;
	 height: 150px;
	 width: 100%;
	 max-width: 600px;
	 left: 0;
	 right: 0;
	 margin: auto;
	 bottom: 0;
		 animation: ${rotate360} .1s linear;
		 display: grid;
		 grid-template-rows: 50px 250px;

		`;
		const OptionsMenuTop = styled.div `
		position: fixed;
		background: rgba(0, 0, 0, 0.73);
		 bottom: 150px;
		 height: 100%;
		 width: 100%;
		 max-width: 600px;
		 left: 0;
		 right: 0;
		 margin: auto;
		`;
		const OtopnsWrapper = styled.div `
margin-top: 40px;
		 `;
		const OptionsItemCon = styled.div `
display: grid;
grid-template-columns: 50px 1fr;
color: #0F2331;
		 `;
		const OptionsItem = styled.img `
width: 20px;
padding: 15px;
			`;
		const CloseIcon = styled.img `
			width: 20px;
			position: absolute;
			right: 10px;
			top: 10px;
			 `;

		//Template
		return (
			<Wrapper>
				<Title>Notes</Title>
				<Container>
					{list}
				</Container>

				<OptionsMenuWrapper>
					<OptionsMenuTop onClick={this.hideOptions}/>
					<OptionsMenuInner>
						<CloseIcon onClick={this.hideOptions} src={Close_Icon} alt="close Icon"/>
						<OtopnsWrapper>

							<OptionsItemCon onClick={this.renameFolder}>
								<OptionsItem src={Rename_img} alt="rename Icon"/>
								<p>Rename</p>
							</OptionsItemCon>
							<OptionsItemCon onClick={this.removeFolder}>
								<OptionsItem src={Remove_img} alt="rename Icon"/>
								<p>Remove</p>
							</OptionsItemCon>

						</OtopnsWrapper>

					</OptionsMenuInner>
				</OptionsMenuWrapper>

			</Wrapper>
		);
	}

}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Notes));
