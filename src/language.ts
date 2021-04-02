import { Control } from './control';

interface Options {
  /* Default language to set (if not set, the browser language is used) */
  language?: string;
}

/**
 * Select and switch the map display language, either by auto-detection of the browser language
 * or manual setting.
 *
 * Requirement: https://github.com/klokantech/openmaptiles-language/
 */
export class Language extends Control {
  private _options?: Options;

  constructor(options?: Options) {
    super();
    this._options = options;
  }

  protected _initialUpdate() {
    super._initialUpdate();

    if (this._map) {
      if (!this._map.autodetectLanguage || !this._map.setLanguage) {
        throw new Error(
          `language() depends on https://github.com/klokantech/openmaptiles-language but it can't be found...`,
        );
      }

      this._map.autodetectLanguage();

      if (this._options?.language) {
        this.setLanguage(this._options.language);
      }
    }
  }

  setLanguage(language: string) {
    if (this._map) {
      this._map.setLanguage(language);
    }
  }
}
