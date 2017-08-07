import React, { Component } from 'react';
import { Jumbotron, Table } from 'react-bootstrap';
import axios from 'axios';
var cookie = require('react-cookies')

class CtrEstimatesPage extends Component {
  constructor(props) {
    super(props)
    this.state = { ctrEstimates: [], errors: [] }
    this.loadDataFromServer = this.loadDataFromServer.bind(this)
  }
  loadDataFromServer() {
    var usr = cookie.load('userId')
    axios.post('http://localhost:3001/api/ctr-estimates', {email: usr})
      .then(res => { 
        this.setState({ctrEstimates: res.data}) 
    }).catch(err => {
      console.log("err:" + err);
    });
    axios.post('http://localhost:3001/api/data-proc-errors', {email: usr})
      .then(res => { 
        this.setState({errors: res.data}) 
    }).catch(err => {
      console.log("err:" + err);
    });
  }
  componentDidMount() {
    this.loadDataFromServer()
    setInterval(this.loadDataFromServer, 2000);
  }
  render() {
    var usr = cookie.load('userId')
    if (usr && this.state.ctrEstimates && this.state.errors) {
      var i = 0
      var ctrEstimateRows = this.state.ctrEstimates.map(ctrEst => {
        i = i + 1
        return (
          <tr key={i}>
            <td>{ctrEst.keywords}</td>
            <td>{ctrEst.ctrEstimate}</td>
          </tr>
        )
      })
      i = 0
      var errorRows = this.state.errors.map(err => {
        i = i + 1
        return (
          <li key={i}>{err.message}</li>
        )
      })
      
      return (
        <div>
          <Jumbotron>
            <h1>CTR Predictor</h1>
            <p>CTR Predictor allows you to automatically estimate the optimal price for keyword combinations used in search engine marketing campaigns.</p>
          </Jumbotron>
          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th>E-Mail</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {ctrEstimateRows}
            </tbody>
          </Table>
          <h2>Data processing errors</h2>
          <ol>
            {errorRows}
          </ol>
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

export default CtrEstimatesPage;