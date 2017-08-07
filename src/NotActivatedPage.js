import React, { Component } from 'react';

class NotActivatedPage extends Component {
  render() {
    return (
      <div>
        <h1>Inactive account</h1>
        <p>Your account hasn't been activated yet. When this happens, you will
        receive a message from our account manager.</p>
        <p>If you have registered more than 48 hours ago and your account is
        still inactive, please contact Dmitri Pisarenko via 
        <a href="mailto:dp@altruix.cc">dp(at)altruix(dot)cc</a>.</p>
      </div>
    )
  }
}

export default NotActivatedPage;