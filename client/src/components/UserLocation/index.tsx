/*
 * Copyright 2021 Google LLC. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// [START maps_react_map]
import { Status, Wrapper } from '@googlemaps/react-wrapper';
import { isLatLngLiteral } from '@googlemaps/typescript-guards';
import { createCustomEqual } from 'fast-equals';
import { User } from 'graphql/_generated';
import React, { Dispatch, useEffect, useRef, useState } from 'react';

const render = (status: Status) => {
  return <h1>{status}</h1>;
};

interface IProps {
  address: string | null;
}

export default function UserLocation({ address }: IProps) {
  // useEffect . . . on user location change, setCenter after call to google.maps.Geocoder
  //
  //
  //
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder>();
  const [map, setMap] = useState<google.maps.Map>();

  //
  //
  //
  //
  // [START maps_react_map_component_app_state]
  const [clicks, setClicks] = useState<google.maps.LatLng[]>([]);
  const [zoom, setZoom] = useState(7); // initial zoom
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({
    lat: 0,
    lng: 0,
  });

  useEffect(() => {
    console.log(address)
    if (!address || address?.length < 3) return;
    geocoder?.geocode({ address: address }, (results, status) => {
      if (!map || !results?.length) {
        console.log(map);
        console.log(results);
        return;
      }
      if (status == window.google.maps.GeocoderStatus.OK) {
        console.log('GeocoderStatus.OK . . .');
        setCenter(results[0].geometry.location.toJSON()); //center the map over the result
      }
    });
  }, [address, geocoder, map]);

  const onClick = (e: google.maps.MapMouseEvent) => {
    // avoid directly mutating state
    setClicks([...clicks, e.latLng!]);
  };

  const onIdle = (m: google.maps.Map) => {
    setZoom(m.getZoom()!);
    setCenter(m.getCenter()!.toJSON());
  };
  // [END maps_react_map_component_app_state]

  const form = (
    <div
      style={{
        padding: '1rem',
        flexBasis: '250px',
        height: '100%',
        overflow: 'auto',
      }}
    >
      <label htmlFor="zoom">Zoom</label>
      <input
        type="number"
        id="zoom"
        name="zoom"
        value={zoom}
        onChange={(event) => setZoom(Number(event.target.value))}
      />
      <br />
      <label htmlFor="lat">Latitude</label>
      <input
        type="number"
        id="lat"
        name="lat"
        value={center.lat}
        onChange={(event) => setCenter({ ...center, lat: Number(event.target.value) })}
      />
      <br />
      <label htmlFor="lng">Longitude</label>
      <input
        type="number"
        id="lng"
        name="lng"
        value={center.lng}
        onChange={(event) => setCenter({ ...center, lng: Number(event.target.value) })}
      />
      <h3>{clicks.length === 0 ? 'Click on map to add markers' : 'Clicks'}</h3>
      {clicks.map((latLng, i) => (
        <pre key={i}>{JSON.stringify(latLng.toJSON(), null, 2)}</pre>
      ))}
      <button onClick={() => setClicks([])}>Clear</button>
    </div>
  );

  // [START maps_react_map_component_app_return]
  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <Wrapper apiKey={process.env.REACT_APP_GMAPS_API_KEY as string} render={render}>
        <Map
          center={center}
          onClick={onClick}
          onIdle={onIdle}
          zoom={zoom}
          map={map}
          setGeocoder={setGeocoder}
          setMap={setMap}
          style={{ flexGrow: '1', height: '100%' }}
        />
      </Wrapper>
      {/* Basic form for controlling center and zoom of map. */}
      {form}
    </div>
  );
  // [END maps_react_map_component_app_return]
}
interface MapProps extends google.maps.MapOptions {
  style: { [key: string]: string };
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
  map: google.maps.Map | undefined;
  setGeocoder: Dispatch<google.maps.Geocoder>;
  setMap: Dispatch<google.maps.Map>;
}

const Map = ({ onClick, onIdle, map, setGeocoder, setMap, style, ...options }: MapProps) => {
  // [START maps_react_map_component_add_map_hooks]
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {}));
      setGeocoder(new window.google.maps.Geocoder());
    }
  }, [ref, map, setGeocoder, setMap]);
  // [END maps_react_map_component_add_map_hooks]

  // [START maps_react_map_component_options_hook]
  // because React does not do deep comparisons, a custom hook is used
  // see discussion in https://github.com/googlemaps/js-samples/issues/946
  useDeepCompareEffectForMaps(() => {
    if (map) {
      map.setOptions(options);
    }
  }, [map, options]);
  // [END maps_react_map_component_options_hook]

  // [START maps_react_map_component_event_hooks]
  useEffect(() => {
    if (map) {
      ['click', 'idle'].forEach((eventName) => google.maps.event.clearListeners(map, eventName));

      if (onClick) {
        map.addListener('click', onClick);
      }

      if (onIdle) {
        map.addListener('idle', () => onIdle(map));
      }
    }
  }, [map, onClick, onIdle]);
  // [END maps_react_map_component_event_hooks]

  // [START maps_react_map_component_return]
  return (
    <>
      <div ref={ref} style={style} />
    </>
  );
  // [END maps_react_map_component_return]
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
