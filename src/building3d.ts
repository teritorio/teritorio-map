import { Control } from './control'

interface Options {
  building3d?: boolean
  pitch?: number
}

/**
 * Select and switch 3D building.
 */
export class Building3d extends Control {
  private _options?: Options

  constructor(options?: Options) {
    super()
    this._options = options
  }

  protected _initialUpdate() {
    super._initialUpdate()
    if (this._options?.building3d) {
      this.set3d(this._options.building3d, this._options?.pitch)
    }
  }

  set3d(building3d: boolean, pitch?: number) {
    if (this._map) {
      if (building3d) {
        // Make it 3D
        if (typeof pitch !== 'undefined') {
          this._map.easeTo({ pitch, duration: 500 })
        }

        this._map.setLayoutProperty('building-3d', 'visibility', 'visible')
        this._map.setLayoutProperty('building', 'visibility', 'none')
        this._map.setLayoutProperty('building-top', 'visibility', 'none')
      } else {
        // Make it flat
        this._map.easeTo({ pitch: 0, duration: 500 })

        this._map.setLayoutProperty('building', 'visibility', 'visible')
        this._map.setLayoutProperty('building-top', 'visibility', 'visible')
        this._map.setLayoutProperty('building-3d', 'visibility', 'none')
      }
    }
  }
}
