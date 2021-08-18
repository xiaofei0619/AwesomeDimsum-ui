import React, { useState } from 'react';
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
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <WrappedMap
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${window.ENV.GOOGLE_MAP_KEY}&v=3.exp&libraries=geometry,drawing,places`}
        loadingElement={<div style={{ height: '100%' }} />}
        containerElement={<div style={{ height: '650px', width: '100%' }} />}
        mapElement={<div style={{ height: '100%' }} />}
      />
    </div>
  );
}
