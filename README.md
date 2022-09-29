# Teritorio Map

Collection of helper functions to add some features to MapLibre GL JD (Mapbox GL JS) related to Teritorio Map Style.

## Display

- [border](https://teritorio.github.io/teritorio-map/border): Select and switch borders point of view according to different countries definition.
- [building3d](https://teritorio.github.io/teritorio-map/building3d): Select and switch the way to display building in 3D or not.
- [poiFilter](https://teritorio.github.io/teritorio-map/poiFilter/index-initial-settings.html): Set initial display of POIs by thematic.
- [poiFilter](https://teritorio.github.io/teritorio-map/poiFilter/index-change.html): Change display of POIs by thematic.

For languages switch use [ openmaptiles-gl-language
](https://github.com/teritorio/openmaptiles-gl-language).

## Usage

The project is bundled in several formats so you can use it everywhere.

If you don't know what format is better for you, choose UMD ;)

### UMD (Universal Module Definition)

To use in your HTML files:

```html
<script
  type="text/javascript"
  src="https://unpkg.com/@teritorio/map/dist/teritorio.umd.production.min.js"
></script>

<script type="text/javascript">
  teritorio.icon(/* ... */);
</script>
```

### CommonJS

To import the library in your bundled project:

```js
import { icon } from '@teritorio/map';

icon(/* ... */);
```

### ES Module

```html
<script type="module">
  import { icon } from 'https://unpkg.com/@teritorio/map/dist/teritorio.esm.js';

  icon(/* ... */);
</script>
```

## Requirements

Requires [maplibre-gl-js](https://maplibre.org/projects/#js) or older [mapbox-gl-js](https://github.com/mapbox/mapbox-gl-js) >= v1.10.1 and < 2.0.0).

## Contribution

Please see the [contribution guide](CONTRIBUTING.md).

## Author

[Teritorio](https://teritorio.fr)

## License

[MIT](LICENSE)
