import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as actions from '../actions';



const withAuth = WrappedComponent => {
  class AuthedComponent extends React.Component {
    state = {
      authCompleted: this.props.loggedIn
    };

    componentDidMount() {
      if (localStorage.getItem('token')) {
        this.props.fetchUser();
        // this.props.user && this.props.user.id ? null : this.props.fetchUser()
        (this.props.listings && this.props.listings.length) ? null : this.props.fetchListings()
      } else {
        this.setState({ authCompleted: true });
      }
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.loggedIn) {
        this.setState({ authCompleted: true });
      }
    }

    render() {
      if (this.state.authCompleted) {
        return this.props.loggedIn ? (
          <WrappedComponent {...this.props} />
        ) : (
          <Redirect to="/login" />
        );
      } else {
        return null;
      }
    }
  }

  const mapStateToProps = state => ({
    loggedIn: !!state.auth.currentUser.id,
    listings: state.listings,
    user: state.user
  });

  return connect(mapStateToProps, actions)(AuthedComponent);
};

export default withAuth;
