export class Control implements maplibregl.IControl {
  protected _map?: maplibregl.Map
  protected _container?: HTMLDivElement
  private _initialUpdateBind: () => void

  constructor(container?: HTMLDivElement) {
    this._initialUpdateBind = this._initialUpdate.bind(this)
    this._container = container
  }

  protected _initialUpdate() {
    // We only update the style once
    this._map?.off('styledata', this._initialUpdateBind)
  }

  onAdd(map: maplibregl.Map) {
    this._map = map
    this._map.on('styledata', this._initialUpdateBind)
    if (!this._container) {
      this._container = document.createElement('div')
    }
    return this._container
  }

  onRemove() {
    this._map?.off('styledata', this._initialUpdateBind)
    this._map = undefined
  }
}
