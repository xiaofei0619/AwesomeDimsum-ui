import React from 'react';
import {
  Navbar, Nav, NavItem, NavDropdown,
  Dropdown, Col, Container,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { LinkContainer } from 'react-router-bootstrap';
import IssueAddNavItem from './IssueAddNavItem.jsx';
import Contents from './Contents.jsx';
import Search from './Search.jsx';
import SignInNavItem from './SignInNavItem.jsx';
import UserContext from './UserContext.js';
import graphQLFetch from './graphQLFetch.js';
import store from './store.js';
import Footer from './Footer.jsx';

function MyNavBar({ user, onUserChange }) {
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
            <LinkContainer exact to="/issues">
              <Nav.Link>ISSUES</Nav.Link>
            </LinkContainer>
            <LinkContainer exact to="/report">
              <Nav.Link>REPORT</Nav.Link>
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
              <SignInNavItem user={user} onUserChange={onUserChange} />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

  // <Navbar>
  //   <Col sm={5}>
  //     <Navbar.Form>
  //       <Search />
  //     </Navbar.Form>
  //   </Col>
  //   <Nav pullRight>
  //     <IssueAddNavItem user={user} />
  //     <SignInNavItem user={user} onUserChange={onUserChange} />
  //     <NavDropdown
  //       id="user-dropdown"
  //       title={<FontAwesomeIcon icon={faCaretDown} size="2x" />}
  //       noCaret
  //     >
  //       <LinkContainer to="/about">
  //         <Dropdown.Item>About</Dropdown.Item>
  //       </LinkContainer>
  //     </NavDropdown>
  //   </Nav>
  // </Navbar>
  );
}

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
    const user = store.userData ? store.userData.user : null;
    delete store.userData;
    this.state = { user };
    this.onUserChange = this.onUserChange.bind(this);
  }

  async componentDidMount() {
    const { user } = this.state;
    if (user == null) {
      const data = await Page.fetchData();
      this.setState({ user: data.user });
    }
  }

  onUserChange(user) {
    this.setState({ user });
  }

  render() {
    const { user } = this.state;
    if (user == null) return null;
    return (
      <div>
        <MyNavBar user={user} onUserChange={this.onUserChange} />
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
