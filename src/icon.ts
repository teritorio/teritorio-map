import mapboxgl from 'mapbox-gl';

enum StyleName {
  Icon = 'icon',
  Picto = 'picto',
}

interface Styles {
  beforeLayer?: string;
  imageLayout?: MapboxValues;
  textColor?: MapboxValues;
}

interface Options {
  /* Default icon style to set */
  defaultStyleName?: StyleName;

  /**
   * If needed you can override the default styles.
   *
   * Eg:
   *
   * ```js
   * {
   *   styles: {
   *     picto: {
   *       beforeLayer: '...',
   *       imageLayout: '...',
   *       textColor: '...'
   *     }
   *   }
   * }
   * ```
   */
  styles?: {
    [key in StyleName]: Styles;
  };
}

/**
 * Select and switch icon emphases, full colored icons of small discreet icons.
 */
export function icon(map: mapboxgl.Map, options?: Options) {
  const styles: { [key in StyleName]: Styles } = {
    [StyleName.Icon]: {
      beforeLayer: 'park-reserve-name-small',
      imageLayout: map.getLayoutProperty('poi-level-1', 'icon-image'),
      textColor: map.getPaintProperty('poi-level-1', 'text-color'),
      ...options?.styles?.[StyleName.Icon],
    },
    [StyleName.Picto]: {
      beforeLayer: 'road_oneway',
      imageLayout: [
        'coalesce',
        [
          'image',
          [
            'concat',
            ['get', 'tourism_superclass'],
            '-',
            ['get', 'tourism_class'],
            '-',
            ['get', 'tourism_subclass'],
            '•',
          ],
        ],
        ['image', ['concat', ['get', 'tourism_superclass'], '-', ['get', 'tourism_class'], '•']],
        ['image', ['concat', ['get', 'tourism_superclass'], '•']],
      ],
      textColor: '#333',
      ...options?.styles?.[StyleName.Picto],
    },
  };

  if (options?.defaultStyleName) {
    setStyle(map, styles[options.defaultStyleName]);
  }

  return {
    setStyle(styleName: StyleName) {
      setStyle(map, styles[styleName]);
    },
  };
}

// map.on('load', function() {});

function setStyle(map: mapboxgl.Map, styles: Styles) {
  map.setLayoutProperty('poi-level-1', 'icon-image', styles.imageLayout);
  map.setLayoutProperty('poi-level-1-icon', 'icon-image', styles.imageLayout);
  map.setLayoutProperty('poi-level-2', 'icon-image', styles.imageLayout);
  map.setLayoutProperty('poi-level-2-icon', 'icon-image', styles.imageLayout);
  map.setLayoutProperty('poi-level-3', 'icon-image', styles.imageLayout);
  map.setLayoutProperty('poi-level-3-icon', 'icon-image', styles.imageLayout);

  map.setPaintProperty('poi-level-1', 'text-color', styles.textColor);
  map.setPaintProperty('poi-level-1-icon', 'text-color', styles.textColor);
  map.setPaintProperty('poi-level-2', 'text-color', styles.textColor);
  map.setPaintProperty('poi-level-2-icon', 'text-color', styles.textColor);
  map.setPaintProperty('poi-level-3', 'text-color', styles.textColor);
  map.setPaintProperty('poi-level-3-icon', 'text-color', styles.textColor);

  map.moveLayer('poi-level-3-icon', styles.beforeLayer);
  map.moveLayer('poi-level-3', styles.beforeLayer);
  map.moveLayer('poi-level-2-icon', styles.beforeLayer);
  map.moveLayer('poi-level-2', styles.beforeLayer);
  map.moveLayer('poi-level-1-icon', styles.beforeLayer);
  map.moveLayer('poi-level-1', styles.beforeLayer);
}
