import mapboxgl from 'mapbox-gl';

interface Options {
  default3d?: boolean;
  defaultPitch?: number;
}

/**
 * Select and switch 3D building.
 */
export function building3d(map: mapboxgl.Map, options?: Options) {
  if (options?.default3d) {
    set3d(map, options?.default3d, options?.defaultPitch);
  }

  return {
    set3d(is3d: boolean, pitch: number) {
      set3d(map, is3d, pitch);
    },
  };
}

function set3d(map: mapboxgl.Map, is3d: boolean, pitch: number = 60) {
  if (is3d) {
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
