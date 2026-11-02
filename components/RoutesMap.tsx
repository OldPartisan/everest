'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo } from 'react';
import { MapContainer, Marker, Polyline, TileLayer, ZoomControl, useMap } from 'react-leaflet';

import type { Camp, Route } from '@/lib/schema';
import { formatAltitude } from '@/lib/format';

type RoutesMapProps = {
  route: Route;
  activeCampId: string | null;
  onSelectCamp: (campId: string) => void;
  visible?: boolean;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function campIcon(camp: Camp, active: boolean): L.DivIcon {
  const classes = [
    'camp-pin',
    active ? 'camp-pin--active' : '',
    camp.type === 'summit' ? 'camp-pin--summit' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const glyph =
    camp.type === 'summit'
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m3 20 7-15 4 8 2-4 5 11H3Z"/></svg>'
      : camp.type === 'base'
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 20h18M5 20 12 5l7 15M9 20l3-7 3 7"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 20h16M6 20 12 6l6 14M9 20l3-6 3 6"/></svg>';

  return L.divIcon({
    className: classes,
    html: `<div class="camp-pin__marker">${glyph}</div><span class="camp-pin__label">${escapeHtml(
      camp.shortName,
    )} · ${escapeHtml(formatAltitude(camp.altitude))} м</span>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function MapController({
  route,
  activeCampId,
  visible,
}: Pick<RoutesMapProps, 'route' | 'activeCampId' | 'visible'>) {
  const map = useMap();

  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(() => map.invalidateSize(), 120);
    return () => window.clearTimeout(timer);
  }, [map, visible]);

  useEffect(() => {
    if (!visible) return;
    const points = route.geometry.map((point) => L.latLng(point.lat, point.lng));
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [34, 34], animate: true, duration: 0.7 });
  }, [map, route, visible]);

  useEffect(() => {
    if (!visible || !activeCampId) return;
    const camp = route.camps.find((item) => item.id === activeCampId);
    if (!camp) return;
    map.flyTo([camp.lat, camp.lng], camp.type === 'summit' ? 11 : 12, {
      duration: 1.2,
      easeLinearity: 0.2,
    });
  }, [activeCampId, map, route, visible]);

  return null;
}

export default function RoutesMap({
  route,
  activeCampId,
  onSelectCamp,
  visible = true,
}: RoutesMapProps) {
  const positions = useMemo(
    () => route.geometry.map((point) => [point.lat, point.lng] as [number, number]),
    [route.geometry],
  );

  return (
    <div className="everest-map h-full w-full" role="region" aria-label={`Карта ${route.name.toLowerCase()}`}>
      <MapContainer
        center={[27.996, 86.89]}
        zoom={12}
        scrollWheelZoom={false}
        zoomControl={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        <Polyline
          positions={positions}
          pathOptions={{ color: '#ffffff', weight: 7, opacity: 0.72, lineCap: 'round' }}
        />
        <Polyline
          positions={positions}
          pathOptions={{ color: '#334155', weight: 3, opacity: 0.92, lineCap: 'round' }}
        />
        {route.camps.map((camp) => (
          <Marker
            key={camp.id}
            position={[camp.lat, camp.lng]}
            icon={campIcon(camp, camp.id === activeCampId)}
            eventHandlers={{ click: () => onSelectCamp(camp.id) }}
            keyboard
            title={`${camp.name}, ${formatAltitude(camp.altitude)} м`}
          />
        ))}
        <MapController route={route} activeCampId={activeCampId} visible={visible} />
      </MapContainer>
    </div>
  );
}
