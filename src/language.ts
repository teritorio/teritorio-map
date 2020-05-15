import mapboxgl from 'mapbox-gl';

interface Options {
  /* Default language to set (if not set, the browser language is used) */
  defaultLanguage?: string;
}

/**
 * Select and switch the map display language, either by auto-detection of the browser language
 * or manual setting.
 *
 * Requirement: https://github.com/klokantech/openmaptiles-language/
 */
export function language(map: mapboxgl.Map, options?: Options) {
  if (!map.autodetectLanguage || !map.setLanguage) {
    throw new Error(
      `language() depends on https://github.com/klokantech/openmaptiles-language but it can't be found...`,
    );
  }

  map.autodetectLanguage();

  if (options?.defaultLanguage) {
    map.setLanguage(options.defaultLanguage);
  }

  return {
    setLanguage(language: string) {
      map.setLanguage(language);
    },
  };
}
