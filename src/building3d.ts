import { Control } from './control'

interface Options {
  container?: HTMLDivElement
  building3d?: boolean
  pitch?: number
}

/**
 * Select and switch 3D building.
 */
export class Building3d extends Control {
  private _options?: Options

  constructor(options?: Options) {
    super(options?.container)
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

        if (this._map.getLayer('building-3d')) {
          this._map.setLayoutProperty('building-3d', 'visibility', 'visible')
        }
        if (this._map.getLayer('building')) {
          this._map.setLayoutProperty('building', 'visibility', 'none')
        }
        if (this._map.getLayer('building-top')) {
          this._map.setLayoutProperty('building-top', 'visibility', 'none')
        }

        this._map.setTerrain({ source: 'alti', exaggeration: 1.5 })
      } else {
        // Make it flat
        this._map.easeTo({ pitch: 0, duration: 500 })

        if (this._map.getLayer('building')) {
          this._map.setLayoutProperty('building', 'visibility', 'visible')
        }
        if (this._map.getLayer('building-top')) {
          this._map.setLayoutProperty('building-top', 'visibility', 'visible')
        }
        if (this._map.getLayer('building-3d')) {
          this._map.setLayoutProperty('building-3d', 'visibility', 'none')
        }

        // @ts-ignore
        this._map.setTerrain()
      }
    }
  }
}
