import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPhone, faFax, faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import {
  faGoogle, faFacebook, faLinkedin, faTwitter, faYoutube, faAlipay, faApplePay,
  faCcAmex, faCcDiscover, faCcVisa, faCcMastercard, faCcPaypal,
} from '@fortawesome/free-brands-svg-icons';
import './Footer.css';

function Footer() {
  return (
    <div className="footer">
      <div className="container">
        <div className="row justify-content-center">
          <div className="footerElement col-4 col-lg-2">
            <h5>LINK</h5>
            <ul className="list-unstyled">
              <li><Link to="/issues">Home</Link></li>
              <li><Link to="/edit/:id">About Us</Link></li>
              <li><Link to="/report">Menu</Link></li>
              <li><Link to="/about">Contact Us</Link></li>
            </ul>
          </div>
          <div className="footerElement col-8 col-lg-3">
            <h5>OUR ADDRESS</h5>
            <address>
              <p>
                1210 Clear Water Bay Road
                <br />
                Seattle, WA 98199, US
              </p>
              <FontAwesomeIcon icon={faPhone} size="1x" />
              : +1(852) 123-5678
              <br />
              <FontAwesomeIcon icon={faFax} size="1x" />
              : +1(852) 876-4321
              <br />
              <FontAwesomeIcon icon={faEnvelope} size="1x" />
              :
              <a href="mailto:awesomedimsum@food.net"> awesomedimsum@food.net</a>
            </address>
          </div>
          <div className="footerElement col-12 col-lg-3">
            <h5>WORKING HOURS</h5>
            <p>
              Sunday&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11:00 AM - 9:00 PM
              <br />
              Monday&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11:00 AM - 9:00 PM
              <br />
              Tuesday&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11:00 AM - 9:00 PM
              <br />
              Wednesday&nbsp;&nbsp;11:00 AM - 9:00 PM
              <br />
              Thursday&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11:00 AM - 9:00 PM
              <br />
              Friday&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11:00 AM - 9:00 PM
              <br />
              Saturday&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11:00 AM - 9:00 PM
              <br />
            </p>
          </div>
          <div className="footerElement col-12 col-lg-4 align-self-center">
            <h5>ACCEPT PAYMENT</h5>
            <div className="text-center">
              <FontAwesomeIcon icon={faAlipay} size="2x" style={{ color: '#DAA520' }} />
              <FontAwesomeIcon icon={faApplePay} size="2x" style={{ marginLeft: 8, color: '#DAA520' }} />
              <FontAwesomeIcon icon={faCcPaypal} size="2x" style={{ marginLeft: 8, color: '#DAA520' }} />
              <FontAwesomeIcon icon={faCcVisa} size="2x" style={{ marginLeft: 8, color: '#DAA520' }} />
              <FontAwesomeIcon icon={faCcAmex} size="2x" style={{ marginLeft: 8, color: '#DAA520' }} />
              <FontAwesomeIcon icon={faCcDiscover} size="2x" style={{ marginLeft: 8, color: '#DAA520' }} />
              <FontAwesomeIcon icon={faCcMastercard} size="2x" style={{ marginLeft: 8, color: '#DAA520' }} />
            </div>
            <h5>FOLLOW US</h5>
            <div className="text-center">
              <a className="btn btn-social-icon btn-google" href="http://google.com/"><FontAwesomeIcon icon={faGoogle} size="2x" /></a>
              <a className="btn btn-social-icon btn-facebook" href="http://www.facebook.com/profile.php?id="><FontAwesomeIcon icon={faFacebook} size="2x" /></a>
              <a className="btn btn-social-icon btn-linkedin" href="http://www.linkedin.com/in/"><FontAwesomeIcon icon={faLinkedin} size="2x" /></a>
              <a className="btn btn-social-icon btn-twitter" href="http://twitter.com/"><FontAwesomeIcon icon={faTwitter} size="2x" /></a>
              <a className="btn btn-social-icon btn-google" href="http://youtube.com/"><FontAwesomeIcon icon={faYoutube} size="2x" /></a>
            </div>
          </div>
        </div>
        <hr />
        <div className="row justify-content-center">
          <div className="text-center">
            <small>
              <p>© Copyright 2021 Awesome Dimsum. All Rights Reserved.</p>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
