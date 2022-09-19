import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Col } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';

/* After the user clicks the "SignOut" link in the NavBar, log them out and display this page. */
export const SignOut = () => {
  Meteor.logout();
  return (
    <Col id={PAGE_IDS.SIGN_OUT} className="text-center py-3">
      <h2>You are signed out.</h2>
    </Col>
  );
};
