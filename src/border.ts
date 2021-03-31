import mapboxgl from 'mapbox-gl';
import { Control } from './control';

enum Country {
  ma = 'ma',
  eh = 'eh',
  rs = 'rs',
  xk = 'xk',
  ru = 'ru',
  ua = 'ua',
  cn = 'cn',
  in = 'in',
  pk = 'pk',
  bt = 'bt',
  sd = 'sd',
  ss = 'ss',
}

const countryCodes: { [key in Country]: number } = {
  ma: 0 ** 2,
  eh: 1 ** 2,
  rs: 2 ** 2,
  xk: 3 ** 2,
  ru: 4 ** 2,
  ua: 5 ** 2,
  cn: 6 ** 2,
  in: 7 ** 2,
  pk: 8 ** 2,
  bt: 9 ** 2,
  sd: 10 ** 2,
  ss: 11 ** 2,
};

interface Options {
  /* Default country border to display */
  country?: Country;
}

let isInitialized = false;

/**
 * Select and switch borders point of view according to different countries definition.
 */
export class Border extends Control {
  _options?: Options;

  constructor(options?: Options) {
    super();
    this._options = options;
  }

  _initialUpdate() {
    super._initialUpdate();
    if (this._map) {
      init(this._map);

      if (this._options?.country) {
        setBorder(this._map, this._options.country);
      } else {
        resetBorder(this._map);
      }
    }
  }

  resetBorder() {
    if (this._map) {
      resetBorder(this._map);
    }
  }

  setBorder(country: Country) {
    if (this._map) {
      setBorder(this._map, country);
    }
  }
}

function resetBorder(map: mapboxgl.Map) {
  map.setFilter('boundary-land-level-2', [
    'all',
    ['==', 'admin_level', 2],
    ['!=', 'maritime', 1],
    ['==', 'neutral', 1],
  ]);
}

function setBorder(map: mapboxgl.Map, country: Country) {
  map.setFilter('boundary-land-level-2', [
    'all',
    ['==', ['to-number', ['get', 'admin_level']], 2],
    ['!=', ['to-number', ['get', 'maritime']], 1],
    [
      'any',
      [
        'all',
        ['==', ['get', 'neutral'], 1],
        [
          '!=',
          ['%', ['floor', ['/', ['to-number', ['get', 'disputed_by']], countryCodes[country]]], 2],
          1,
        ],
      ],
      [
        '==',
        ['%', ['floor', ['/', ['to-number', ['get', 'claimed_by']], countryCodes[country]]], 2],
        1,
      ],
    ],
  ]);
}

function init(map: mapboxgl.Map) {
  if (isInitialized) {
    return;
  }

  isInitialized = true;

  map.addLayer(
    {
      filter: ['all', ['!=', 'maritime', 1], ['==', 'disputed', 1]],
      id: 'boundary-land-disputed',
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': 'hsl(248, 7%, 70%)',
        'line-dasharray': [1, 3],
        'line-width': {
          base: 1,
          stops: [
            [0, 0.6],
            [4, 1.4],
            [5, 2],
            [12, 8],
          ],
        },
      },
      source: 'openmaptiles',
      'source-layer': 'boundary',
      type: 'line',
    },
    'boundary-land-level-2',
  );
}
