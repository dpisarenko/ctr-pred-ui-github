import React, { Component } from 'react';
import { Row, Col, Jumbotron, Modal, Button } from 'react-bootstrap';
import SignUpForm from './SignUpForm';
import LogInForm from './LogInForm';


class EntryPage extends Component {
  constructor(props) {
    super(props)
    this.state = {error: false, errorMessage: ''};
    this.setErrorState = this.setErrorState.bind(this)
  }
  closeModalBox() {
    this.setState({error: false, errorMessage: ''});
  }
  getInitialState() {
    return {error: false, errorMessage: ''};
  }
  displayUserCreationError(errorMessage) {
    this.setParentState({error: true, errorMessage: errorMessage})
  }  
  render() {
    var errorBox;
    if (this.state.error) {
      errorBox = (
        <div>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Title>An error occured</Modal.Title>
            </Modal.Header>
            <Modal.Body>{this.state.errorMessage}</Modal.Body>
            <Modal.Footer>
              <Button onClick={this.closeModalBox.bind(this)}>Close</Button>
            </Modal.Footer>
          </Modal.Dialog>
        </div>
      )
    }
    return (
      <div>
        <Jumbotron>
          <h1>CTR Predictor</h1>
          <p>CTR Predictor allows you to automatically estimate the optimal price for keyword combinations used in search engine marketing campaigns.</p>
        </Jumbotron>
        <Row>
          <Col xs={6} md={3}><SignUpForm setParentState={this.setErrorState.bind(this)} /></Col>
          <Col xs={6} md={3}><LogInForm setParentState={this.setErrorState.bind(this)} /></Col>
        </Row>
        {errorBox}
      </div>
    )    
  }
  setErrorState(values) {
    this.setState(values)
  }
}

export default EntryPage;