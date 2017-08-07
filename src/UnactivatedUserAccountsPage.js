import React, { Component } from 'react';
import { Jumbotron, Button, Table } from 'react-bootstrap';
import axios from 'axios';
var cookie = require('react-cookies')

class UnactivatedUserAccountsPage extends Component {
  constructor(props) {
    super(props)
    this.state = { data: [] }
    this.loadDataFromServer = this.loadDataFromServer.bind(this)
  }
  loadDataFromServer() {
    axios.get('http://localhost:3001/api/unactivated-users')
      .then(res => { 
        this.setState({data: res.data}) 
    });
  }
  componentDidMount() {
    this.loadDataFromServer()
    setInterval(this.loadDataFromServer, 2000);
  }
  accept(email) {
    axios.post('http://localhost:3001/api/activateUser', {email: email})
      .then(res => { 
      })
    .catch(err => {
      console.log("err:" + err);
    })      
  }
  reject(email) {
    axios.post('http://localhost:3001/api/rejectUser', {email: email})
      .then(res => { 
      })
    .catch(err => {
      console.log("err:" + err);
    })      
  }
  render() {
    var usr = cookie.load('userId')
    var admin = cookie.load('admin')
    if (usr && admin && this.state.data) {
      var userRows = this.state.data.map(user => {
        var acceptHandler = () => this.accept(user.email)
        var rejectHandler = () => this.reject(user.email)
        return (
          <tr key={user.email}>
            <td>{user.email}</td>
            <td><Button onClick={acceptHandler}>Accept</Button> 
            <Button onClick={rejectHandler}>Reject</Button></td>
          </tr>
        )
      })
      return (
        <div>
          <Jumbotron>
            <h1>CTR Predictor</h1>
            <p>CTR Predictor allows you to automatically estimate the optimal price for keyword combinations used in search engine marketing campaigns.</p>
          </Jumbotron> 
          <h2>Unactivated User accounts</h2>
          <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>E-Mail</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {userRows}
          </tbody>
          </Table>
        </div>
      )
    } else if (usr && admin) {
      return (
        <div>
          <Jumbotron>
            <h1>CTR Predictor</h1>
            <p>CTR Predictor allows you to automatically estimate the optimal price for keyword combinations used in search engine marketing campaigns.</p>
          </Jumbotron> 
          <h2>Unactivated User accounts</h2>
          <p>Waiting for the response from the server</p>
        </div>
      )      
    }
    else {
      window.location.href = '/';
      return (
        <div></div>
      )
    }
  }
}

export default UnactivatedUserAccountsPage;