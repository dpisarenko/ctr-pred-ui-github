import React, { Component } from 'react';
import { 
  FormGroup, 
  ControlLabel, 
  FormControl, 
  Button
} from 'react-bootstrap';
import axios from 'axios';
import style from './style';

class SignUpForm extends Component {
  constructor(props) {
    super(props)
    this.state = {email: ''};
    this.setParentState = props.setParentState
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleEmailChange(evt) {
    this.setState({ email: evt.target.value });
  }
  handleSubmit(evt) {
    evt.preventDefault()
    var email = this.state.email
    axios.post(
      'http://localhost:3001/api/users', 
      {
        'email': email
      })
      .then(res => {
        var success = res.data.success
        if (success) {
          // TODO: Send e-mail
          var pw = res.data.result
          this.sendEmail(email, pw)
        } else {
          var errorMessage = res.data.errorMessage
          this.displayUserCreationError(errorMessage)
        }
      })
      .catch(err => {
        console.log("err:" + err);
        this.displayUserCreationError("Internal error")
      });
  }
  sendEmail(email, pw) {
    console.log("email: " + email + ", pw: " + pw)
    axios.post(
      'http://localhost:3001/api/mail', 
      {
        'email': email,
        'pw': pw
      })
      .then(res => {
        window.location.href = '/signup-confirm';
      })
      .catch(err => {
          console.log("err:" + err);
          this.displayUserCreationError("Internal error")
        })
  }
  displayUserCreationError(errorMessage) {
    this.setParentState({error: true, errorMessage: errorMessage})
  }
  render() {
    return (
      <div style={style.signUpForm}>
        <form onSubmit={ this.handleSubmit }>
          <FormGroup controlId="formBasicText">
          <FormGroup>
            <ControlLabel>Email address</ControlLabel>
            <FormControl 
              type="email" 
              placeholder="Enter email"
              onChange={ this.handleEmailChange }
            />
          </FormGroup>
          <Button type="submit">Sign Up</Button>
          <p>Your password will be sent to your e-mail address.</p>
          </FormGroup>
        </form>
      </div>
    )
  }
}

export default SignUpForm;