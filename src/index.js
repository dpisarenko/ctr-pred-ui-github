import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'

import EntryPage from './EntryPage'
import SignUpConfirmationPage from './SignUpConfirmationPage'
import MainLoggedInPage from './MainLoggedInPage'
import NotActivatedPage from './NotActivatedPage'
import UnactivatedUserAccountsPage from './UnactivatedUserAccountsPage'
import SubmitCampaignDataPage from './SubmitCampaignDataPage'
import CtrEstimatesPage from './CtrEstimatesPage'

var entryPage = () => ( new EntryPage() )
var signupConfirmationPage = () => ( new SignUpConfirmationPage() )
var mainLoggedInPage = () => ( new MainLoggedInPage() )
var notActivatedPage = () => ( new NotActivatedPage() )
var unactivatedUserAccountsPage = () => ( new UnactivatedUserAccountsPage() )
var submitCampaignDataPage = () => (new SubmitCampaignDataPage() )
var ctrEstimatesPage = () => ( new CtrEstimatesPage() )

ReactDOM.render(  
  (<Router>
    <Switch>
      <Route path="/signup-confirm" component={signupConfirmationPage}/>
      <Route path="/main" component={mainLoggedInPage}/>
      <Route path="/not-activated" component={notActivatedPage}/>
      <Route path="/unactivated-user-accounts" component={unactivatedUserAccountsPage}/>
      <Route path="/submit-campaign-data" component={submitCampaignDataPage}/>
      <Route path="/ctr-estimates" component={ctrEstimatesPage}/>
      <Route path="/" component={entryPage}/>
    </Switch>
  </Router>),
  document.getElementById('root')
);