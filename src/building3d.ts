import mapboxgl from 'mapbox-gl';
import { Control } from './control';

interface Options {
  building3d?: boolean;
  pitch?: number;
}

/**
 * Select and switch 3D building.
 */
export class Building3d extends Control {
  _options?: Options;

  constructor(options?: Options) {
    super();
    this._options = options;
  }

  _initialUpdate() {
    super._initialUpdate();
    if (this._map && this._options?.building3d) {
      set3d(this._map, this._options.building3d, this._options?.pitch);
    }
  }

  set3d(building3d: boolean, pitch: number) {
    if (this._map) {
      set3d(this._map, building3d, pitch);
    }
  }
}

function set3d(map: mapboxgl.Map, building3d: boolean, pitch: number = 60) {
  if (building3d) {
    // Make it 3D
    if (typeof pitch !== 'undefined') {
      map.easeTo({ pitch, duration: 500 });
    }

    map.setLayoutProperty('building-3d', 'visibility', 'visible');
    map.setLayoutProperty('building', 'visibility', 'none');
    map.setLayoutProperty('building-top', 'visibility', 'none');
  } else {
    // Make it flat
    map.easeTo({ pitch: 0, duration: 500 });

    map.setLayoutProperty('building', 'visibility', 'visible');
    map.setLayoutProperty('building-top', 'visibility', 'visible');
    map.setLayoutProperty('building-3d', 'visibility', 'none');
  }
}
