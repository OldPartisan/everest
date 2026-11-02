'use client';

import { useReducedMotion } from 'framer-motion';
import maplibregl, {
  type GeoJSONSource,
  type Map as MapLibreMap,
  type Marker,
  type StyleSpecification,
} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef, useState } from 'react';

import type { Camp, Route } from '@/lib/schema';
import { formatAltitude } from '@/lib/format';

type RoutesMapProps = {
  route: Route;
  activeCampId: string | null;
  onSelectCamp: (campId: string) => void;
  visible?: boolean;
};

const mapStyle: StyleSpecification = {
  version: 8,
  sources: {
    'osm': {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      maxzoom: 19,
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
};

function iconMarkup(type: Camp['type']): string {
  if (type === 'summit') {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m3 20 7-15 4 8 2-4 5 11H3Z"/></svg>';
  }
  if (type === 'base') {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 20h18M5 20 12 5l7 15M9 20l3-7 3 7"/></svg>';
  }
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 20h16M6 20 12 6l6 14M9 20l3-6 3 6"/></svg>';
}

function createCampElement(
  camp: Camp,
  active: boolean,
  onSelect: (campId: string) => void,
): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = [
    'camp-pin',
    active ? 'camp-pin--active' : '',
    camp.type === 'summit' ? 'camp-pin--summit' : '',
  ]
    .filter(Boolean)
    .join(' ');
  button.setAttribute('aria-label', `${camp.name}, ${formatAltitude(camp.altitude)} м`);

  const marker = document.createElement('span');
  marker.className = 'camp-pin__marker';
  marker.innerHTML = iconMarkup(camp.type);

  const label = document.createElement('span');
  label.className = 'camp-pin__label';
  label.textContent = `${camp.shortName} · ${formatAltitude(camp.altitude)} м`;

  button.append(marker, label);
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    onSelect(camp.id);
  });
  return button;
}

export default function RoutesMap({
  route,
  activeCampId,
  onSelectCamp,
  visible = true,
}: RoutesMapProps) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibreMap | null>(null);
  const markers = useRef<Marker[]>([]);
  const selectRef = useRef(onSelectCamp);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    selectRef.current = onSelectCamp;
  }, [onSelectCamp]);

  useEffect(() => {
    if (!container.current) return;
    let instance: MapLibreMap;

    try {
      instance = new maplibregl.Map({
        container: container.current,
        style: mapStyle,
        center: [86.89, 27.996],
        zoom: 12,
        minZoom: 9,
        maxZoom: 16,
        dragRotate: false,
        pitchWithRotate: false,
        touchPitch: false,
        attributionControl: false,
      });
    } catch {
      setFailed(true);
      return undefined;
    }

    instance.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      'bottom-right',
    );
    instance.addControl(
      new maplibregl.AttributionControl({ compact: false }),
      'bottom-right',
    );

    map.current = instance;
    instance.on('load', () => setReady(true));
    const resize = () => instance.resize();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      markers.current.forEach((marker) => marker.remove());
      markers.current = [];
      instance.remove();
      map.current = null;
      setReady(false);
    };
  }, []);

  useEffect(() => {
    if (!visible || !map.current) return;
    const timer = window.setTimeout(() => map.current?.resize(), 80);
    return () => window.clearTimeout(timer);
  }, [visible]);

  // Route line + camera fit. Markers are updated separately so camp selection does not reset the view.
  useEffect(() => {
    const instance = map.current;
    if (!instance || !ready) return;

    const coordinates = route.geometry.map((point) => [point.lng, point.lat]);
    const data = {
      type: 'Feature' as const,
      properties: {},
      geometry: { type: 'LineString' as const, coordinates },
    };

    const source = instance.getSource('route') as GeoJSONSource | undefined;
    if (source) {
      source.setData(data);
    } else {
      instance.addSource('route', { type: 'geojson', data });
      instance.addLayer({
        id: 'route-halo',
        type: 'line',
        source: 'route',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#ffffff', 'line-width': 7, 'line-opacity': 0.72 },
      });
      instance.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#334155', 'line-width': 3, 'line-opacity': 0.96 },
      });
    }

    const bounds = new maplibregl.LngLatBounds();
    route.geometry.forEach((point) => bounds.extend([point.lng, point.lat]));
    instance.fitBounds(bounds, {
      padding: 42,
      maxZoom: 13,
      duration: reduced ? 0 : 700,
    });
  }, [ready, reduced, route]);

  useEffect(() => {
    const instance = map.current;
    if (!instance || !ready) return;

    markers.current.forEach((marker) => marker.remove());
    markers.current = route.camps.map((camp) => {
      const element = createCampElement(camp, camp.id === activeCampId, (id) =>
        selectRef.current(id),
      );
      return new maplibregl.Marker({ element, anchor: 'center' })
        .setLngLat([camp.lng, camp.lat])
        .addTo(instance);
    });
  }, [activeCampId, ready, route]);

  useEffect(() => {
    const instance = map.current;
    if (!instance || !ready || !activeCampId) return;
    const camp = route.camps.find((item) => item.id === activeCampId);
    if (!camp) return;
    instance.flyTo({
      center: [camp.lng, camp.lat],
      zoom: camp.type === 'summit' ? 11 : 12,
      duration: reduced ? 0 : 1100,
      essential: true,
    });
  }, [activeCampId, ready, reduced, route]);

  return (
    <div
      className="everest-map relative h-full w-full"
      role="region"
      aria-label={`Карта ${route.name.toLowerCase()}`}
    >
      <div ref={container} className="h-full w-full" />
      {failed && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg-1 p-6 text-center">
          <p className="max-w-xs text-xs leading-6 text-ink-1">
            Не удалось запустить WebGL-карту. Список лагерей с высотами доступен ниже.
          </p>
        </div>
      )}
    </div>
  );
}
