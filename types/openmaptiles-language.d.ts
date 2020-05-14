declare module mapboxgl {
  interface Map {
    autodetectLanguage(fallbackLanguage?: string): void;
    setLanguage(language: string, noAlt?: boolean): void;
    setLanguageEnabled(enable: boolean): void;
  }
}
