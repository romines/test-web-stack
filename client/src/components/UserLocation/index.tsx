/*
 * Adapted from https://github.com/googlemaps/js-samples/tree/main/samples/react-map
 *
 */

import { Status, Wrapper } from '@googlemaps/react-wrapper';
import { isLatLngLiteral } from '@googlemaps/typescript-guards';
import { createCustomEqual } from 'fast-equals';
import React, { Dispatch, useEffect, useRef, useState } from 'react';

const render = (status: Status) => {
  return <h1>{status}</h1>;
};

interface IProps {
  address: string | null;
}

export default function UserLocation({ address }: IProps) {
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder>();
  const [map, setMap] = useState<google.maps.Map>();
  const [zoom, setZoom] = useState(8); // initial zoom
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({
    lat: 0,
    lng: 0,
  });

  useEffect(() => {
    if (!address || address?.length < 3) return;
    geocoder?.geocode({ address: address }, (results, status) => {
      if (!results?.length) return;
      if (status == window.google.maps.GeocoderStatus.OK) {
        setCenter(results[0].geometry.location.toJSON());
      }
    });
  }, [address, geocoder, map]);

  const onIdle = (m: google.maps.Map) => {
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    setZoom(m.getZoom()!);
    setCenter(m.getCenter()!.toJSON());
    /* eslint-enable @typescript-eslint/no-non-null-assertion */
  };

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <Wrapper apiKey={process.env.REACT_APP_GMAPS_API_KEY as string} render={render}>
        <Map
          center={center}
          onIdle={onIdle}
          zoom={zoom}
          map={map}
          setGeocoder={setGeocoder}
          setMap={setMap}
          style={{ flexGrow: '1', height: '100%' }}
        >
          <Marker position={center} />
        </Map>
      </Wrapper>
    </div>
  );
}

interface MapProps extends google.maps.MapOptions {
  style: { [key: string]: string };
  onIdle?: (map: google.maps.Map) => void;
  map: google.maps.Map | undefined;
  setGeocoder: Dispatch<google.maps.Geocoder>;
  setMap: Dispatch<google.maps.Map>;
  children?: React.ReactNode;
}

const Map = ({ onIdle, map, setGeocoder, setMap, style, children, ...options }: MapProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {}));
      setGeocoder(new window.google.maps.Geocoder());
    }
  }, [ref, map, setGeocoder, setMap]);

  useDeepCompareEffectForMaps(() => {
    if (map) {
      map.setOptions(options);
    }
  }, [map, options]);

  useEffect(() => {
    if (map) {
      google.maps.event.clearListeners(map, 'idle');

      if (onIdle) {
        map.addListener('idle', () => onIdle(map));
      }
    }
  }, [map, onIdle]);

  return (
    <>
      <div ref={ref} style={style} />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          return React.cloneElement(child, { map });
        }
      })}
    </>
  );
};

const Marker: React.FC<google.maps.MarkerOptions> = (options) => {
  const [marker, setMarker] = React.useState<google.maps.Marker>();

  React.useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker());
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  React.useEffect(() => {
    if (marker) {
      marker.setOptions(options);
    }
  }, [marker, options]);

  return null;
};

const deepCompareEqualsForMaps = createCustomEqual((deepEqual) => (a: any, b: any) => {
  if (
    isLatLngLiteral(a) ||
    a instanceof google.maps.LatLng ||
    isLatLngLiteral(b) ||
    b instanceof google.maps.LatLng
  ) {
    return new google.maps.LatLng(a).equals(new google.maps.LatLng(b));
  }

  // TODO extend to other types

  // use fast-equals for other objects
  return deepEqual(a, b);
});

function useDeepCompareMemoize(value: any) {
  const ref = useRef();

  if (!deepCompareEqualsForMaps(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

function useDeepCompareEffectForMaps(callback: React.EffectCallback, dependencies: any[]) {
  useEffect(callback, dependencies.map(useDeepCompareMemoize));
}
