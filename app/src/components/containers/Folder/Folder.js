import React from 'react';
import styled, {keyframes} from 'styled-components'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux';
import File from '../../global/File_link_2.js';
import BtnAudioInput from '../../global/BtnAudioInput.js';
import {TweenMax} from 'gsap';
import firebase from 'firebase';
import {bindActionCreators} from 'redux';
import {
  Change_TopBar_Title,
  Hide_Snackbar,
  Set_Playback_Id,
  FolderSelection_ID,
  FolderSelection_Name,
  Toggle_OptinsMenuHideFile,
  Set_Snackbar_Name,
  Show_Snackbar
} from '../../../state/actions/index';
import FloatingButton from '../../global/FloatButton.js';
import Rename_img from '../../../images/icons/rename.svg';
import Remove_img from '../../../images/icons/rubbish-bin.svg';
import Close_Icon from '../../../images/icons/close.svg';
import Button from '../../global/Button.js';
import CircularProgress from 'material-ui/CircularProgress';

//define actions to use
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    Change_TopBar_Title,
    Hide_Snackbar,
    Set_Playback_Id,
    FolderSelection_ID,
    FolderSelection_Name,
    Toggle_OptinsMenuHideFile,
    Set_Snackbar_Name,
    Show_Snackbar
  }, dispatch)
}
function mapStateToProps(state) {
  return {
    options: state.OtionsMenu_ToggleFile,
    id: state.FolderLink_ID,
    name: state.FolderLink_Name,
    fileID: state.File_Delete_ID,
    folderName: state.FileSelection_Rename,
    nameFolder: state.TopBar_Title
  }
}
class Folder extends React.Component {

  //initial state
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      alert: '',
      renameInput: false,
      open: false,
      inputRename: '',
      loading: true

    }
  }

  //Methods
  componentWillMount() {
    let id = window.location.pathname.substr(8)
		firebase.database().ref('/users/' + firebase.auth().currentUser.uid + '/folders/' + id).once('value').then((snap) => {
      let snapValue = snap.val();
			this.props.Change_TopBar_Title(snapValue.name);
			this.props.Hide_Snackbar();
	    this.fetchData(id)
    })


  }
  fetchData = (id) => {

    if (this.props.id === '') {
      this.setState({alert: 'No Notes in this folder'});
    }

    let userId = firebase.auth().currentUser.uid;
    let array = [];

    return firebase.database().ref('/users/' + userId + '/masterNotes').orderByChild('folderID').equalTo(id).once('value').then((snap) => {
      let list = {},
        snapValue = snap.val();

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
      this.setState({loading: false});

    });

  }

  openRecord = () => {
    // console.log(this.props.folderName);
    this.props.FolderSelection_Name(this.props.nameFolder);
    this.props.FolderSelection_ID(this.props.id);
    this.props.history.push(`/record`);
  }

  handleCloseRename = (e) => {
    this.setState({renameInput: false});
    // this.setState({title: ''});
    e.preventDefault();

  };
  hideOptions = () => {
    this.props.Toggle_OptinsMenuHideFile();
  }

  removeFile = () => {
    //remove notes in mastern notes
    firebase.database().ref('/users/' + firebase.auth().currentUser.uid + '/notes').orderByChild('masterNote_id').equalTo(this.props.fileID).once('value').then((snap) => {
      let res = snap.val();
      for (var prop in res) {
        if (res.hasOwnProperty(prop)) {
          // console.log(prop);
          firebase.database().ref(`users/${firebase.auth().currentUser.uid}/notes/${prop}`).remove();
        }
      }
    });

    //remove folder
    // console.log(this.props.folderID);
    firebase.database().ref(`users/${firebase.auth().currentUser.uid}/masterNotes/${this.props.fileID}`).remove();

    this.fetchData();
    this.props.Toggle_OptinsMenuHideFile();
    this.props.Set_Snackbar_Name('Note Removed');
    let SnackBar = document.querySelector('#MySnackBar')
    TweenMax.to(SnackBar, .5, {
      delay: .5,
      bottom: "50px"
    });
    TweenMax.to(SnackBar, .5, {
      delay: 2,
      bottom: "-50px"
    });
    // this.props.Hide_Snackbar();
    // this.props.Show_Snackbar();

  }

  renameFile = () => {
    //show rename input
    this.props.Toggle_OptinsMenuHideFile();
    this.setState({renameInput: true});

  }

  submitnewName = (e) => {
    // console.log(this.inputRename.value);
    e.preventDefault();
    // console.log(this.props.folderID);
    this.setState({renameInput: false});
    this.props.Toggle_OptinsMenuHideFile();
    firebase.database().ref(`users/${firebase.auth().currentUser.uid}/masterNotes/${this.props.fileID}`).update({name: this.inputRename.value});
    // this.setState({title: ''});
    this.props.Set_Snackbar_Name('File Renamed');
    let SnackBar = document.querySelector('#MySnackBar')
    TweenMax.to(SnackBar, .5, {
      delay: .5,
      bottom: "50px"
    });
    TweenMax.to(SnackBar, .5, {
      delay: 2,
      bottom: "-50px"
    });
    // this.props.Hide_Snackbar();
    // this.props.Show_Snackbar();
    this.setState({list: []});

    this.fetchData();

  }

  render() {
    //Properties
    let list = this.state.list.map((item, i) => <span key={item.id}><File key={item.id} id={item.id} width="auto" name={item.name}/></span>);

    const Dialog = styled.form `
		display: ${props => this.state.open
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
    const DialogRename = styled.form `
		display: ${props => this.state.renameInput
      ? 'block'
      : 'none'};
		position: fixed;
		background: rgba(0, 0, 0, 0.73);
		height: 100%;
		width: 100%;
		top: 0;
		left: 0;
		z-index: 40;
		`;
    let inputStyle = {
      width: '80%',
      display: 'block',
      margin: 'auto',
      height: '30px',
      fontSize: '16px',
      borderColor: 'transparent',
      borderWidth: '0px'
    }
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
    const InnerDialog = styled.div `
				border-radius: 2px;
			 position: absolute;
			 background: white;
			 height: 220px;
			 max-width: 600px;
			 width: 75%;
			 left: 0;
			 right: 0;
			 top: 0;
			 bottom: 0;
			 margin: auto;
			 display: grid;
			 grid-template-rows: 50px 50px 50px;
			 grid-row-gap: 24px;
				`;

    const SubTitle = styled.h2 `
				color: #0F2331;
			 width: 80%;
			 display: block;
			 margin: auto;
			 margin-top: 20px;
			 font-size: 20px;
			 line-height: 32px;
			 font-weight: 400;
				`;

    const ButtonCon = styled.div `
				display: grid;
				grid-template-columns: 1fr 1fr;
				`;
    //Template
    return (this.state.loading === true
      ? <LoadingCon><CircularProgress size={80} thickness={5} color="#42EA9C"/>
          Loading...</LoadingCon>
      : <div>
        <BtnAudioInput location="folder"/>

        <Wrapper>
          {list}
        </Wrapper>
        <FloatingButtonCon onClick={this.openRecord}>
          <FloatingButton/>
        </FloatingButtonCon>

        <Dialog onSubmit={this.submit}>
          <InnerDialog>
            <SubTitle>Name file</SubTitle>
            <input autoFocus maxLength="11" style={inputStyle} type="text" placeholder="Type here..." ref={(input) => this.input = input}/>

            <ButtonCon>
              <span onClick={this.handleClose}>
                <Button text="Cancel" color="#9E9E9E"/>
              </span>
              <span >
                <Button type="submit" text="Create" color="#44F6A3"/>
              </span>
            </ButtonCon>
          </InnerDialog>
        </Dialog>
        <OptionsMenuWrapper>
          <OptionsMenuTop onClick={this.hideOptions}/>
          <OptionsMenuInner>
            <CloseIcon onClick={this.hideOptions} src={Close_Icon} alt="close Icon"/>
            <OtopnsWrapper>

              <OptionsItemCon onClick={this.renameFile}>
                <OptionsItem src={Rename_img} alt="rename Icon"/>
                <p>Rename</p>
              </OptionsItemCon>
              <OptionsItemCon onClick={this.removeFile}>
                <OptionsItem src={Remove_img} alt="rename Icon"/>
                <p>Remove</p>
              </OptionsItemCon>

            </OtopnsWrapper>

          </OptionsMenuInner>
        </OptionsMenuWrapper>
        <DialogRename onSubmit={this.submitnewName}>
          <InnerDialog>
            <SubTitle>Rename file</SubTitle>
            <input autoFocus maxLength="11" style={inputStyle} type="text" defaultValue={this.props.folderName} placeholder="Type here..." ref={(input) => this.inputRename = input}/>

            <ButtonCon>
              <span onClick={this.handleCloseRename}>
                <Button text="Cancel" color="#9E9E9E"/>
              </span>
              <span >
                <Button type="submit" text="Rename" color="#44F6A3"/>
              </span>
            </ButtonCon>
          </InnerDialog>
        </DialogRename>
      </div>);
  }

}

//Style
const Wrapper = styled.div `
display: grid;
grid-template-columns: 1fr 1fr;
grid-column-gap: 10px;
grid-row-gap: 10px;
padding-bottom: 90px;

`;
const FloatingButtonCon = styled.span `
position: fixed;
bottom: 20px;
right: 0;
`;

const LoadingCon = styled.div `
   position: absolute;
   left: 0;
   right: 0;
   top: 0;
   bottom: 0;
   margin: auto;
   width: 80px;
   height: 80px;
   `;
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Folder));
