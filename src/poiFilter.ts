import mapboxgl from 'mapbox-gl';

interface Options {
  filter?: Array<any>;
  include?: boolean;
}

/**
 * Select and switch 3D building.
 */
export function poiFilter(map: mapboxgl.Map, options?: Options) {
  if (options?.filter) {
    applyFilter(map, options?.filter, options?.include);
  }

  return {
    setExcludeFilter(filter: Array<any>) {
      applyFilter(map, filter, false);
    },
    setIncludeFilter(filter: Array<any>) {
      applyFilter(map, filter, true);
    },
    unsetFilter() {
      unsetFilter(map);
    },
  };
}

const poiLayers = [
  'poi-level-1',
  'poi-level-1-icon',
  'poi-level-2',
  'poi-level-2-icon',
  'poi-level-3',
  'poi-level-3-icon',
];

const filterId = ['==', ['literal', '__poiFilter'], '__poiFilter'];

function pruneFilter(filter: any): any {
  if (filter[0] !== 'all') {
    return undefined;
  }

  return filter.filter(
    (close: any) =>
      !(
        close instanceof Array &&
        close.length >= 2 &&
        close[0] === 'all' &&
        JSON.stringify(close[1]) === JSON.stringify(filterId)
      ),
  );
}

function createFilterExpression(filter: Array<any>): Array<any> {
  const f1 = filter?.filter(f => f.length === 1).map(f => f[0]);
  const f2 = filter?.filter(f => f.length === 2).map(f => f.join('|'));
  const f3 = filter?.filter(f => f.length === 3).map(f => f.join('|'));

  var expression: Array<any> = ['any'];
  if (f1.length > 0) {
    expression.push(['in', ['get', 'tourism_superclass'], ['literal', f1]]);
  }
  if (f2.length > 0) {
    expression.push([
      'in',
      ['concat', ['get', 'tourism_superclass'], '|', ['get', 'tourism_class']],
      ['literal', f2],
    ]);
  }
  if (f3.length > 0) {
    expression.push([
      'in',
      [
        'concat',
        ['get', 'tourism_superclass'],
        '|',
        ['get', 'tourism_class'],
        '|',
        ['get', 'tourism_subclass'],
      ],
      ['literal', f3],
    ]);
  }
  return expression;
}

function applyFilter(map: mapboxgl.Map, filter: Array<any>, include: boolean = true) {
  let expression: any;
  if (include) {
    expression = ['all', filterId, createFilterExpression(filter)];
  } else {
    expression = ['all', filterId, ['!', createFilterExpression(filter)]];
  }

  poiLayers.forEach(layerId => {
    let styleFilter = map.getFilter(layerId);
    styleFilter = pruneFilter(styleFilter);
    if (!styleFilter) {
      console.log(`Cannot amend filter of layer "{layerId}"`);
    } else {
      styleFilter.push(expression);
      console.log(JSON.stringify(styleFilter));
      map.setFilter(layerId, styleFilter);
    }
  });
}

export function unsetFilter(map: mapboxgl.Map) {
  poiLayers.forEach(layerId => {
    let styleFilter = map.getFilter(layerId);
    styleFilter = pruneFilter(styleFilter);
    if (!styleFilter) {
      console.warn(`Cannot amend filter of layer "${layerId}"`);
    } else {
      map.setFilter(layerId, styleFilter);
    }
  });
}
