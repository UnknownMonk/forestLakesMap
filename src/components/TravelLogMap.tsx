'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import type { TravelLogEntryWithId } from '@/models/TravelLog/TravelLog';
import {
  useCallback,
  useContext,
  useLayoutEffect,
  useEffect,
  useState,
} from 'react';
import TravelLogContext from '@/TravelLogContext';
import {
  TravelLogActionType,
  TravelLogDispatch,
} from '@/types/TravelLogProviderTypes';

if (!process.env.NEXT_PUBLIC_MAP_TILE_URL) {
  throw new Error('Missing NEXT_PUBLIC_MAP_TILE_URL in .env.local');
}

const createIcon = (fill = '#56BC58', iconSize = 32) => {
  return L.divIcon({
    className: 'bg-transparent',
    html: `<svg viewBox="0 0 24 24" width="${iconSize}" height="${iconSize}" fill="${fill}" stroke="black" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="shadow-xl"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize / 2, iconSize],
  });
};

L.Marker.prototype.options.icon = createIcon();

const currentMarkerIcon = createIcon('#F2BB05', 40);

interface TravelLogMapProps {
  logs: TravelLogEntryWithId[];
}

interface InitMapProps {
  logs: TravelLogEntryWithId[];
  onMapClick: (event: L.LeafletMouseEvent) => void;
  dispatch: TravelLogDispatch;
}

const InitMap = ({ logs, onMapClick, dispatch }: InitMapProps) => {
  const map = useMap();
  useLayoutEffect(() => {
    setTimeout(() => {
      dispatch({
        type: TravelLogActionType.SET_MAP,
        data: map,
      });
      map.invalidateSize();

      map.setZoom(15.8);
      map.setView([29.086308, -81.833532]);

      map.on('click', onMapClick);
      // TODO: less hacky way...
    }, 100);
  }, [map, logs, onMapClick, dispatch]);
  return null;
};

export default function TravelLogMap({ logs }: TravelLogMapProps) {
  const [stuff, setStuff] = useState({});
  console.log(stuff, 'stuff-----------------------------------');
  useEffect(() => {
    setStuff(logs);
  }, [logs]);
  const { state, dispatch } = useContext(TravelLogContext);
  const onMapClick = useCallback(
    (e: L.LeafletMouseEvent) => {
      dispatch({
        type: TravelLogActionType.SET_SIDEBAR_VISIBLE,
        data: true,
      });
      dispatch({
        type: TravelLogActionType.SET_CURRENT_MARKER_LOCATION,
        data: e.latlng,
      });
      if (state.map) {
        const zoomLevel = state.map.getZoom();
        state.map.flyTo(e.latlng, zoomLevel > 5 ? zoomLevel : 5);
      }
    },
    [state.map, dispatch]
  );
  return (
    <MapContainer
      worldCopyJump={true}
      className="w-full h-full"
      style={{ background: '#242525' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://jonasport.</a> contributors'
        url={process.env.NEXT_PUBLIC_MAP_TILE_URL || ''}
      />
      <InitMap logs={logs} dispatch={dispatch} onMapClick={onMapClick} />
      {state.currentMarkerLocation && (
        <Marker
          icon={currentMarkerIcon}
          eventHandlers={{
            dragend(e) {
              dispatch({
                type: TravelLogActionType.SET_CURRENT_MARKER_LOCATION,
                data: e.target.getLatLng(),
              });
            },
          }}
          draggable
          position={state.currentMarkerLocation}
        ></Marker>
      )}
      {logs.map((log) => (
        <Marker
          key={log._id.toString()}
          position={[log.latitude, log.longitude]}
        >
          <Popup offset={[0, -10]}>
            <p className=" w-[350px] text-lg font-bold">{log.title}</p>
            <p>{log.description}</p>
            <p className="text-sm italic">
              {new Date(log.visitDate).toLocaleDateString()}
            </p>
            <div className="flex justify-center items-center">
              <img className="h-5/6 w-5/6" alt={log.title} src={log.image} />
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
