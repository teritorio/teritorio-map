# Teritorio Map

Collection of helper functions to add some features to Mapbox GL JS related to Teritorio Map Style.

## Display

- [border](https://teritorio.github.io/teritorio-map/border): Select and switch borders point of view according to different countries definition.
- [language](https://teritorio.github.io/teritorio-map/language): Select and switch the map display language, either by auto-detection of the browser language or manual setting.
- [building3d](https://teritorio.github.io/teritorio-map/building3d): Select and switch the way to display building in 3D or not.
- [poiFilter](https://teritorio.github.io/teritorio-map/poiFilter/index-initial-settings.html): Set initial display of POIs by thematic.
- [poiFilter](https://teritorio.github.io/teritorio-map/poiFilter): Change display of POIs by thematic.

## Usage

The project is bundled in several formats so you can use it everywhere.

If you don't know what format is better for you, choose UMD ;)

### UMD (Universal Module Definition)

To use in your HTML files:

```html
<script
  type="text/javascript"
  src="https://unpkg.com/@teritorio/map@0.7.0/dist/teritorio.umd.production.min.js"
></script>

<script type="text/javascript">
  teritorio.icon(/* ... */);
  teritorio.language(/* ... */);
</script>
```

### CommonJS

To import the library in your bundled project:

```js
import { icon, language } from '@teritorio/map';

icon(/* ... */);
language(/* ... */);
```

### ES Module

```html
<script type="module">
  import { icon, language } from 'https://unpkg.com/@teritorio/map@0.7.0/dist/teritorio.esm.js';

  icon(/* ... */);
  language(/* ... */);
</script>
```

## Requirements

- <https://github.com/mapbox/mapbox-gl-js> (>= v1.10.1)
- <https://github.com/klokantech/openmaptiles-language> (only for the `language` feature)

## Contribution

Please see the [contribution guide](CONTRIBUTING.md).

## Author

[Teritorio](https://teritorio.fr)

## License

[MIT](LICENSE)
