import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker,
  InfoWindow,
} from 'react-google-maps';

function Map() {
  const [selected, setSelected] = useState(null);

  return (
    <GoogleMap
      defaultZoom={14}
      defaultCenter={{ lat: 47.620506, lng: -122.349274 }}
    >
      <Marker
        position={{ lat: 47.620506, lng: -122.349274 }}
        onClick={() => {
          setSelected(1);
        }}
        icon={{
          url: '/image/logo1.png',
          scaledSize: new window.google.maps.Size(80, 80),
        }}
      />
      {selected && (
        <InfoWindow
          position={{ lat: 47.620506, lng: -122.349274 }}
          onCloseClick={() => {
            setSelected(null);
          }}
        >
          <div>
            <h3>Awesome Dimsum</h3>
            <p>1210 Clear Water Bay Road</p>
            <p>Seattle, WA 98199, US</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

const WrappedMap = withScriptjs(withGoogleMap(Map));

// const WrappedMap = withScriptjs(withGoogleMap((props => (
//   <GoogleMap
//     defaultZoom={12}
//     defaultCenter={{ lat: 47.620506, lng: -122.349274 }}
//   >
//     <Marker position={{ lat: 47.620506, lng: -122.349274 }} />
//   </GoogleMap>
// ))));

export default function FooterMap() {
  const [userLat, setUserLat] = useState(null);
  const [userLng, setUserLng] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  console.log('In the map!!!!');
  console.log(userStatus);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setUserStatus('Geolocation is not supported by your browser');
    } else {
      setUserStatus('Locating...');
      // console.log(navigator.geolocation.getCurrentPosition);
      navigator.geolocation.getCurrentPosition((position) => {
        setUserStatus('Success');
        setUserLat(position.coords.latitude);
        setUserLng(position.coords.longitude);
      }, (err) => {
        setUserStatus('Unable to retrieve your location');
        console.log(err);
      });
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Button
        variant="dark"
        onClick={getLocation}
      >
        Get My Current Location
      </Button>
      <p>{userStatus}</p>
      {userLat && <p>Latitude: {userLat}</p>}
      {userLng && <p>Longitude: {userLng}</p>}
      <WrappedMap
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${window.ENV.GOOGLE_MAP_KEY}&v=3.exp&libraries=geometry,drawing,places`}
        loadingElement={<div style={{ height: '100%' }} />}
        containerElement={<div style={{ height: '650px', width: '100%' }} />}
        mapElement={<div style={{ height: '100%' }} />}
      />
    </div>
  );
}
