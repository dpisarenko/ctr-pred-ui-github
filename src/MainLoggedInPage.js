import React, { Component } from 'react';
import { Jumbotron, Button } from 'react-bootstrap';
import axios from 'axios';
var cookie = require('react-cookies')

class MainLoggedInPage extends Component {
  constructor(props) {
    super(props)
    this.logout = this.logout.bind(this)
    this.unactivatedUserAccounts = this.unactivatedUserAccounts.bind(this)
    this.submitCampaignData = this.submitCampaignData.bind(this)
    this.insertSampleData = this.insertSampleData.bind(this)
    this.ctrEstimates = this.ctrEstimates.bind(this)
  }
  componentDidMount() {
  }
  logout(evt) {
    evt.preventDefault()
    cookie.remove('userId', { path: '/' })
    cookie.remove('admin', { path: '/' })
    window.location.href = '/';
  }
  insertSampleData(evt) {
    evt.preventDefault()
    axios.post(
      'http://localhost:3001/api/insert-sample-data', {})
      .then(res => {
        console.log("Sample data insertion request has been executed")
      })
      .catch(err => {
          console.log("err:" + err);
        })
  }
  
  unactivatedUserAccounts(evt) {
    evt.preventDefault()
    window.location.href = '/unactivated-user-accounts'
  }
  submitCampaignData(evt) {
    evt.preventDefault()
    window.location.href = '/submit-campaign-data'
  }
  ctrEstimates(evt) {
    evt.preventDefault()
    window.location.href = '/ctr-estimates'
  }
  render() {
    var usr = cookie.load('userId')
    var admin = cookie.load('admin')
    var unactivatedUserAccountsButton
    var insertSampleDataButton
    if (usr) {
      if (admin === 'true') {
        unactivatedUserAccountsButton = (
          <div>
            <Button bsSize="large" onClick={this.unactivatedUserAccounts}>Unactivated User Accounts</Button>
          </div>
        )
        insertSampleDataButton = (
          <div>
            <Button bsSize="large" onClick={this.insertSampleData}>Insert sample data</Button>
          </div>        
        )
      }
      return (
        <div>
          <Jumbotron>
            <h1>CTR Predictor</h1>
            <p>CTR Predictor allows you to automatically estimate the optimal price for keyword combinations used in search engine marketing campaigns.</p>
          </Jumbotron>
          {unactivatedUserAccountsButton}
          {insertSampleDataButton}
          <Button bsSize="large" onClick={this.submitCampaignData}>Submit campaign data</Button>
          <Button bsSize="large" onClick={this.ctrEstimates}>CTR estimates</Button>
          <Button bsSize="large" onClick={this.logout}>Log out</Button>
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

export default MainLoggedInPage;