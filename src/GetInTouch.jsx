import React from 'react';
import FooterMap from './FooterMap.jsx';
import './GetInTouch.css';

function isInBrowser() {
  try {
    localStorage.getItem('100');
    console.log('in browser ....');
    return true;
  } catch (err) {
    console.log('in server....');
    return false;
  }
}

function GetInTouch() {
  return (
    <div id="contact">
      <div className="container" style={{ marginTop: '80px', marginBottom: '100px', fontSize: 'large' }}>
        <div className="d-flex justify-content-around">
          <div className="col-12 col-lg-3">
            <h5>OUR WORKING HOURS</h5>
            <p style={{ marginTop: '15px' }}>
              Sunday&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11:00 AM - 9:00 PM
              <br />
              Monday&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11:00 AM - 9:00 PM
              <br />
              Tuesday&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11:00 AM - 9:00 PM
              <br />
              Wednesday&nbsp;&nbsp;&nbsp;&nbsp;11:00 AM - 9:00 PM
              <br />
              Thursday&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11:00 AM - 9:00 PM
              <br />
              Friday&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11:00 AM - 9:00 PM
              <br />
              Saturday&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11:00 AM - 9:00 PM
              <br />
            </p>
          </div>
          <div className="col-8 col-lg-3">
            <h5>ADDRESS</h5>
            <address>
              <p>
                1210 Clear Water Bay Road
                <br />
                Seattle, WA 98199, US
              </p>
            </address>
          </div>
          <div className="col-8 col-lg-3">
            <h5>EMAIL</h5>
            <address>
              <p>
                awesomedimsum@food.net
              </p>
            </address>
          </div>
          <div className="col-8 col-lg-3">
            <h5>HOTLINE </h5>
            <address>
              <p>
                +1(852) 876-4321
              </p>
            </address>
          </div>
        </div>
      </div>
      <div style={{ maxHeight: '650px' }}>
        {isInBrowser() ? <FooterMap /> : null}
      </div>
    </div>
  );
}

export default GetInTouch;
