/** @jsx React.DOM */
/**
 * Copyright (c) 2014, Tidepool Project
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 */

var React = window.React;
var _ = window._;
var config = window.config;

var Person = require('../../core/person');
var PeopleList = require('../../components/peoplelist');

var Patients = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    fetchingUser: React.PropTypes.bool,
    patients: React.PropTypes.array,
    fetchingPatients: React.PropTypes.bool,
    trackMetric: React.PropTypes.func.isRequired
  },

  render: function() {
    var userPatient = this.renderUserPatient();
    var sharedPatients = this.renderSharedPatients();

    /* jshint ignore:start */
    return (
      <div className="patients js-patients-page">
        <div className="container-box-outer patients-box-outer">
          <div className="container-box-inner patients-box-inner">
            <div className="patients-content">
              <div className="patients-section js-patients-user">
                <div className="patients-section-title">YOUR CARE TEAM</div>
                {userPatient}
              </div>
              <div className="patients-section js-patients-shared">
                <div className="patients-section-title">CARE TEAMS YOU BELONG TO</div>
                {sharedPatients}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    /* jshint ignore:end */
  },

  renderUserPatient: function() {
    var patient;

    if (this.isResettingUserData()) {
      // Render a placeholder list while we wait for data
      return this.renderPatientList([{}]);
    }

    var user = this.props.user;

    if (!Person.isPatient(user)) {
      /* jshint ignore:start */
      return (
        <div className="patients-empty-list">
          <a
            className="js-create-patient-profile"
            href="#/patients/new"
            onClick={this.handleClickCreateProfile}>
            <i className="icon-add"></i>{' ' + 'Create your profile'}
          </a>
        </div>
      );
      /* jshint ignore:end */
    }

    return this.renderPatientList([user]);
  },

  isResettingUserData: function() {
    return (this.props.fetchingUser && !this.props.user);
  },

  handleClickCreateProfile: function() {
    this.props.trackMetric('Clicked Create Profile');
  },

  renderSharedPatients: function() {
    var patients;

    if (this.isResettingPatientsData()) {
      // Render a placeholder list while we wait for data
      patients = [{}, {}];
      return this.renderPatientList(patients);
    }

    patients = this.props.patients;

    if (_.isEmpty(patients)) {
      /* jshint ignore:start */
      return (
        <div className="patients-empty-list patients-empty-list-message js-patients-shared-empty">
          When someone adds you to their care team, it will appear here.
        </div>
      );
      /* jshint ignore:end */
    }

    return this.renderPatientList(patients);
  },

  renderPatientList: function(patients) {
    if (patients) {
      patients = this.addLinkToPatients(patients);
    }

    /* jshint ignore:start */
    return (
      <PeopleList
        people={patients}
        isPatientList={true}
        onClickPerson={this.handleClickPatient}/>
    );
    /* jshint ignore:end */
  },

  isResettingPatientsData: function() {
    return (this.props.fetchingPatients && !this.props.patients);
  },

  addLinkToPatients: function(patients) {
    return _.map(patients, function(patient) {
      patient = _.cloneDeep(patient);
      if (patient.userid) {
        patient.link = '#/patients/' + patient.userid + '/data';
      }
      return patient;
    });
  },

  handleClickPatient: function(patient) {
    if (Person.isSame(this.props.user, patient)) {
      this.props.trackMetric('Clicked Own Care Team');
    }
    else {
      this.props.trackMetric('Clicked Other Care Team');
    }
  }
});

module.exports = Patients;
