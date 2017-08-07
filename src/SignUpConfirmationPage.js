import React, { Component } from 'react';

class SignUpConfirmationPage extends Component {
  render() {
    return (
      <div>
        <h2>Thank you for signing up</h2>
        <p>You will receive your password in your e-mail inbox shortly.</p>
        <p>If you haven't, please check your spam folder.</p>
        <p>In case of any difficulties, please contact us via <a href="mailto:dp@altruix.cc">dp(at)altruix(dot)cc</a>.</p>
      </div>
    )
  }
}

export default SignUpConfirmationPage;