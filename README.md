# Teritorio Map

Collection of helper functions to add some features to Mapbox GL JS.

## Display

- [border](docs/border/index.html): Select and switch borders point of view according to different countries definition.
- [icon](docs/icon/index.html): Select and switch icon emphases, full colored icons of small discreet icons.
- [language](docs/language/index.html): Handle the map display language, either by auto-detection of the browser language or manual setting.

### Interaction

- [click](click): Get details of map objects.

## Usage

The project is bundled in several formats so you can use it everywhere.

If you don't know what format is better for you, choose UMD ;)

### UMD (Universal Module Definition)

To use in your HTML files:

```html
<script
  type="text/javascript"
  src="https://unpkg.com/@teritorio/map@0.1.0/dist/teritorio-map.umd.production.min.js"
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
```

### ES Module

```html
<script type="module">
  import { icon, language } from 'https://unpkg.com/@teritorio/map@0.1.0/dist/teritorio-map.esm.js';

  icon(/* ... */);
  language(/* ... */);
</script>
```

## Requirements

- https://github.com/mapbox/mapbox-gl-js
- https://github.com/klokantech/openmaptiles-language (only for the `language` feature)

## Contribution

Please see the [contribution guide](CONTRIBUTING.md).

## Author

[Teritorio](https://teritorio.fr)

## License

[MIT](LICENSE)
