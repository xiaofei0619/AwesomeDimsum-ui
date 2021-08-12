import React from 'react';
import {
  Navbar, Nav, Container,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import IssueAddNavItem from './IssueAddNavItem.jsx';
import Contents from './Contents.jsx';
import SignInNavItem from './SignInNavItem.jsx';
import UserContext from './UserContext.js';
import graphQLFetch from './graphQLFetch.js';
import store from './store.js';
import Footer from './Footer.jsx';
import CartNavItem from './CartNavItem.jsx';

// eslint-disable-next-line react/prefer-stateless-function
class MyNavBar extends React.Component {
  render() {
    const { onUserChange } = this.props;
    const user = this.context;

    return (
      <Navbar expand="lg" bg="dark" variant="dark">
        <Container>
          <LinkContainer exact to="/home">
            <Navbar.Brand>
              <img
                alt=""
                src="/image/logo1.png"
                width="60"
                height="60"
                className="d-inline-block align-top"
              />
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <LinkContainer exact to="/home">
                <Nav.Link>HOME</Nav.Link>
              </LinkContainer>
              <LinkContainer exact to="/menu">
                <Nav.Link>ORDER</Nav.Link>
              </LinkContainer>
              <LinkContainer exact to="/report">
                <Nav.Link>REPORT</Nav.Link>
              </LinkContainer>
              <LinkContainer exact to="/issues">
                <Nav.Link>ISSUES</Nav.Link>
              </LinkContainer>
              <LinkContainer exact to="/about">
                <Nav.Link>ABOUT</Nav.Link>
              </LinkContainer>
            </Nav>
            <Nav>
              <Nav.Link>
                <IssueAddNavItem user={user} />
              </Nav.Link>
              <Nav.Link>
                <CartNavItem />
              </Nav.Link>
              <Nav.Link>
                <SignInNavItem user={user} onUserChange={onUserChange} />
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}
MyNavBar.contextType = UserContext;

export default class Page extends React.Component {
  static async fetchData(cookie) {
    const query = `query { user {
      signedIn givenName
    }}`;
    const data = await graphQLFetch(query, null, null, cookie);
    return data;
  }

  constructor(props) {
    super(props);
    const userInfo = store.userData ? store.userData.user : null;
    delete store.userData;

    const updateCartItems = (items) => {
      this.setState(state => ({
        user: {
          ...state.user,
          cartItems: items,
        },
      }));
    };

    this.state = {
      user: {
        signedIn: userInfo.signedIn,
        givenName: userInfo.givenName,
        cartItems: {},
        updateCartItems,
      },
    };
    this.onUserChange = this.onUserChange.bind(this);
  }

  async componentDidMount() {
    const { user } = this.state;
    if (user == null) {
      const data = await Page.fetchData();
      this.setState(state => ({
        user: {
          ...state.user,
          signedIn: data.user.signedIn,
          givenName: data.user.givenName,
        },
      }));
    }
  }

  onUserChange(userInfo) {
    this.setState(state => ({
      user: {
        ...state.user,
        signedIn: userInfo.signedIn,
        givenName: userInfo.givenName,
      },
    }));
  }

  render() {
    const { user } = this.state;
    console.log('!!!!!!!!');
    console.log(user);
    if (user == null) return null;
    return (
      <div>
        <UserContext.Provider value={user}>
          <MyNavBar onUserChange={this.onUserChange} />
        </UserContext.Provider>
        <div className="container-fluid px-0">
          <UserContext.Provider value={user}>
            <Contents />
          </UserContext.Provider>
        </div>
        <Footer />
      </div>
    );
  }
}
