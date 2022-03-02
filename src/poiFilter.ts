import mapboxgl from 'mapbox-gl';
import { Control } from './control';

type PoisFilter = string[]
type PoisFilters = PoisFilter[]

interface Options {
  filter?: PoisFilters;
  include?: boolean;
  picto?: boolean;
}


export class PoiFilter extends Control {
  private _options?: Options;

  constructor(options?: Options) {
    super();
    this._options = options;
  }

  protected _initialUpdate() {
    super._initialUpdate();
    if (this._map && this._options?.filter) {
      applyFilter(this._map, this._options?.filter, this._options?.include, this._options?.picto);
    }
  }

  setExcludeFilter(filter: PoisFilters, picto: boolean = true) {
    if (this._map) {
      applyFilter(this._map, filter, false, picto);
    }
  }

  setIncludeFilter(filter: PoisFilters, picto: boolean = true) {
    if (this._map) {
      applyFilter(this._map, filter, true, picto);
    }
  }

  remove(picto: boolean = true) {
    if (this._map) {
      applyFilter(this._map, [], true, picto);
    }
  }

  reset() {
    if (this._map) {
      unsetFilter(this._map);
    }
  }
}

// Redirection function

function applyFilter(
  map: mapboxgl.Map,
  filter: PoisFilters,
  include: boolean = true,
  picto: boolean = true,
) {
  if (!filter || !Array.isArray(filter)) {
    return;
  }

  if (picto) {
    unsetHideFilter(map);
    applyPictoLayout(map, filter, include);
  } else {
    unsetPictoLayout(map);
    applyHideFilter(map, filter, include);
  }
}

function unsetFilter(map: mapboxgl.Map) {
  unsetHideFilter(map);
  unsetPictoLayout(map);
}

const poiLayers = [
  'poi-level-1-picto',
  'poi-level-2-picto',
  'poi-level-3-picto',
  'poi-level-1',
  'poi-level-2',
  'poi-level-3',
];

const filterId: MapboxExpr = ['let', '_bloc_name', 'poiFilter'];

function formatExpressionLiterals(filters: PoisFilters, filterLength: number): string[] {
  return filters
    .filter((f): f is PoisFilter => Array.isArray(f) && f.length === filterLength)
    .map(f => (filterLength === 1 ? f[0] : f.join('|')));
}

function createFilterExpression(filter: PoisFilters): MapboxExpr {
  const f1 = formatExpressionLiterals(filter, 1);
  const f2 = formatExpressionLiterals(filter, 2);
  const f3 = formatExpressionLiterals(filter, 3);

  const expression: MapboxExpr = ['any'];

  if (f1.length > 0) {
    expression.push(['in', ['get', 'superclass'], ['literal', f1]]);
  }

  if (f2.length > 0) {
    expression.push([
      'in',
      ['concat', ['get', 'superclass'], '|', ['get', 'class']],
      ['literal', f2],
    ]);
  }

  if (f3.length > 0) {
    expression.push([
      'in',
      ['concat', ['get', 'superclass'], '|', ['get', 'class'], '|', ['get', 'subclass']],
      ['literal', f3],
    ]);
  }
  return expression;
}

// Hide POI

function pruneHideFilter(filter: MapboxExpr): MapboxExpr | undefined {
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

function applyHideFilter(map: mapboxgl.Map, filter: PoisFilters, include: boolean = true) {
  let expression: MapboxExpr;

  if (include) {
    expression = filterId.concat([createFilterExpression(filter)]);
  } else {
    expression = filterId.concat([['!', createFilterExpression(filter)]]);
  }

  poiLayers.forEach(layerId => {
    const styleFilter = pruneHideFilter(map.getFilter(layerId));

    if (!styleFilter) {
      console.warn(`Cannot amend filter of layer "${layerId}"`);
    } else {
      styleFilter.push(expression);
      map.setFilter(layerId, styleFilter);
    }
  });
}

function unsetHideFilter(map: mapboxgl.Map) {
  poiLayers.forEach(layerId => {
    const styleFilter = pruneHideFilter(map.getFilter(layerId));

    if (!styleFilter) {
      console.warn(`Cannot amend filter of layer "${layerId}"`);
    } else {
      map.setFilter(layerId, styleFilter);
    }
  });
}

// Switch to picto

const filterPictoId: MapboxExpr = ['let', '_bloc_name', 'styleFilter'];
const defaultStyle: MapboxExpr = ['get', 'style'];

function ammendPictoFilter(filter: MapboxExpr, styleExpression: MapboxExpr): MapboxExpr | undefined {
  if (!filter || filter[0] !== 'all') {
    return undefined;
  }

  const close = filter.find(
    close =>
      Array.isArray(close) &&
      close.length === filterPictoId.length + 1 &&
      close[0] === filterPictoId[0] &&
      close[1] === filterPictoId[1] &&
      close[2] === filterPictoId[2],
  ) as MapboxExpr;

  if (close && close[3] && (close[3] as MapboxExpr)[2]) {
    (close[3] as MapboxExpr)[2] = styleExpression;
  }

  return filter;
}

function resetPictoLayout(expr: MapboxExpr): MapboxExpr | undefined {
  if (!expr || !expr[4]) {
    return undefined;
  }

  if (
    !Array.isArray(expr[4]) ||
    expr[4][0] !== 'case' ||
    !Array.isArray(expr[4][1]) ||
    expr[4][1][0] !== 'let'
  ) {
    return undefined;
  }

  expr[4] = defaultStyle;

  return expr;
}

function applyPictoLayout(map: mapboxgl.Map, filter: PoisFilters, include: boolean = true) {
  let expression: MapboxExpr;

  if (include) {
    expression = filterId.concat([['!', createFilterExpression(filter)]]);
  } else {
    expression = filterId.concat([createFilterExpression(filter)]);
  }

  poiLayers.forEach(layerId => {
    const layout = map.getLayoutProperty(layerId, 'icon-image');
    const styleExpression = ['case', expression, '•', defaultStyle];

    if (!layout) {
      console.warn(`Cannot amend filter of layer "${layerId}"`);
    } else {
      layout[4] = styleExpression;
      map.setLayoutProperty(layerId, 'icon-image', layout);
    }

    map.setFilter(layerId, ammendPictoFilter(map.getFilter(layerId), styleExpression));
  });
}

function unsetPictoLayout(map: mapboxgl.Map) {
  poiLayers.forEach(layerId => {
    const layout = resetPictoLayout(map.getLayoutProperty(layerId, 'icon-image'));

    if (!layout) {
      console.warn(`Cannot amend layout of layer "${layerId}"`);
    } else {
      map.setLayoutProperty(layerId, 'icon-image', layout);
    }

    map.setFilter(layerId, ammendPictoFilter(map.getFilter(layerId), defaultStyle));
  });
}
