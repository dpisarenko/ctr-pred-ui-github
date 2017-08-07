import React, { Component } from 'react';
import { Jumbotron, Button } from 'react-bootstrap';
import axios from 'axios';
var FileInput = require('react-file-input');
var cookie = require('react-cookies')

class SubmitCampaignDataPage extends Component {
  constructor(props) {
    super(props)
    this.state = {file: undefined}
    this.handleSubmit = this.handleSubmit.bind(this)
    this.fileUploadChange = this.fileUploadChange.bind(this)
  }
  handleSubmit(evt) {
    evt.preventDefault()
    var usr = cookie.load('userId')
    var file = this.state.file    
    var config = {
    }
    var formData = new FormData()
    formData.append("email", usr)
    formData.append("file", file)
    
    axios.post(
      'http://localhost:3001/api/campaign-data', 
      formData,
      config).then(res => {
        console.log("Upload complete")
      })
      .catch (err => {
        console.log("err:" + err);
      })
  }
  fileUploadChange(evt) {
    var file = evt.target.files[0]
    this.setState({file: file})
  }
  render() {
    var usr = cookie.load('userId')
    if (usr) {
      return (
        <div>
          <Jumbotron>
            <h1>CTR Predictor</h1>
            <p>CTR Predictor allows you to automatically estimate the optimal price for keyword combinations used in search engine marketing campaigns.</p>
          </Jumbotron>
          <p>Select the file with the latest campaign data and press the "Submit Data" button.</p>
          <form onSubmit={ this.handleSubmit }>
            <FileInput name="myImage"
                   accept=".ods"
                   placeholder="Data file"
                   onChange={this.fileUploadChange} />
            <p>You will receive a notification via e-mail, once these data have been processed.</p>
            <Button type="submit">Submit Data</Button>            
          </form>
        </div>
      )
    } else {
      window.location.href = '/';
      return (
        <div></div>
      )
    }
  }
}

export default SubmitCampaignDataPage;