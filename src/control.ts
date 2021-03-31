import mapboxgl from 'mapbox-gl';

export class Control {
  _map?: mapboxgl.Map;
  _container: any;
  _initialUpdateBind: () => void;

  constructor() {
    this._initialUpdateBind = this._initialUpdate.bind(this);
  }

  _initialUpdate() {
    // We only update the style once
    this._map?.off('styledata', this._initialUpdateBind);
  }

  onAdd(map: mapboxgl.Map) {
    this._map = map;
    this._map.on('styledata', this._initialUpdateBind);
    this._container = document.createElement('div');
    return this._container;
  }

  onRemove() {
    this._map?.off('styledata', this._initialUpdateBind);
    this._map = undefined;
  }
}
