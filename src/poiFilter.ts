import mapboxgl from 'mapbox-gl';

interface Options {
  filter?: MapboxExpr;
  include?: boolean;
}

export function poiFilter(map: mapboxgl.Map, options?: Options) {
  if (options?.filter) {
    applyFilter(map, options?.filter, options?.include);
  }

  return {
    setExcludeFilter(filter: MapboxExpr) {
      applyFilter(map, filter, false);
    },
    setIncludeFilter(filter: MapboxExpr) {
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

const filterId: MapboxExpr = ['let', '_bloc_name', 'poiFilter'];

function pruneFilter(filter: MapboxExpr) {
  if (!filter || filter[0] !== 'all') {
    return undefined;
  }

  return filter.filter(
    close =>
      !(
        Array.isArray(close) &&
        close.length === filterId.length + 1 &&
        close[0] === filterId[0] &&
        close[1] === filterId[1] &&
        close[2] === filterId[2]
      ),
  );
}

function formatExpressionLiterals(filters: MapboxExpr, filterLength: number) {
  return filters
    .filter((f): f is MapboxExpr => Array.isArray(f) && f.length === filterLength)
    .map(f => (filterLength === 1 ? f[0] : f.join('|')));
}

function createFilterExpression(filter: MapboxExpr) {
  const f1 = formatExpressionLiterals(filter, 1);
  const f2 = formatExpressionLiterals(filter, 2);
  const f3 = formatExpressionLiterals(filter, 3);

  const expression: MapboxExpr = ['any'];

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

function applyFilter(map: mapboxgl.Map, filter: MapboxExpr, include: boolean = true) {
  if (!filter || !Array.isArray(filter)) {
    return;
  }

  let expression: MapboxExpr;

  if (include) {
    expression = filterId.concat([createFilterExpression(filter)]);
  } else {
    expression = filterId.concat([['!', createFilterExpression(filter)]]);
  }

  poiLayers.forEach(layerId => {
    const styleFilter = pruneFilter(map.getFilter(layerId));

    if (!styleFilter) {
      console.warn(`Cannot amend filter of layer "${layerId}"`);
    } else {
      styleFilter.push(expression);
      map.setFilter(layerId, styleFilter);
    }
  });
}

function unsetFilter(map: mapboxgl.Map) {
  poiLayers.forEach(layerId => {
    const styleFilter = pruneFilter(map.getFilter(layerId));

    if (!styleFilter) {
      console.warn(`Cannot amend filter of layer "${layerId}"`);
    } else {
      map.setFilter(layerId, styleFilter);
    }
  });
}
