import React, { Component } from 'react';
import { 
  FormGroup, 
  ControlLabel, 
  FormControl, 
  Button
} from 'react-bootstrap';
import axios from 'axios';
import style from './style';
var cookie = require('react-cookies')


class LogInForm extends Component {
  constructor(props) {
    super(props)
    this.state = {email: '', pw: ''}
    this.setParentState = props.setParentState
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleEmailChange(evt) {
    this.setState({email: evt.target.value})
  }
  handlePasswordChange(evt) {
    this.setState({pw: evt.target.value})
  }
  handleSubmit(evt) {
    evt.preventDefault()
    var email = this.state.email
    var pw = this.state.pw
    axios.post(
      'http://localhost:3001/api/auth', {
        'email': email,
        'pw': pw
        
      })
      .then(res => {
        var success = res.data.success
        var activated = res.data.activated
        var admin = res.data.admin
        if (success && activated) {
          console.log("admin:" + admin)
          cookie.save('userId', email, { path: '/' })
          cookie.save('admin', admin, { path: '/' })
          window.location.href = '/main';
        } else if (success && !activated) {
          window.location.href = '/not-activated';
        }        
        else {
          this.displayUserCreationError("Invalid e-mail and/or password")
        }
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
          <FormGroup
            controlId="formBasicText"
          >
            <FormGroup>
              <ControlLabel>Email address</ControlLabel>
              <FormControl 
                type="email" 
                placeholder="Enter email"
                onChange={ this.handleEmailChange }
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Password</ControlLabel>
              <FormControl 
                type="password" 
                placeholder="Password"
                onChange={ this.handlePasswordChange }
              />
            </FormGroup>
            <Button type="submit">Log In</Button>
          </FormGroup>
        </form>
      </div>
    )
  }
}

export default LogInForm;