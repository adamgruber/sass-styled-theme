sass-styled-theme
---

Extract global variables from Sass stylesheets into a JS object.

## Huh? Why?

I work on a team that uses Sass. We've got a shared variables file that gets referenced throughout our styleguide and in our components. I wanted to start using [styled-components][] in some projects and wanted to keep things consistent but I didn't want to have to copy our Sass variables over. With this package I can simply reference our shared variables file and it will be converted into a JS object that gets passed down to my components via styled-components' [`<ThemeProvider>`][theming].

## Cool! How do I get it?

```sh
$ yarn add sass-styled-theme
```

*(npm install works too)*

## Nice! How do I use it?

Wrap your App in a ThemeProvider component like this:

```jsx
// Import the lib
import sassToStyledTheme from 'sass-styled-theme';

// Call the function with absolute path to your Sass file
const theme = sassToStyledTheme('./path/to/vars.scss');

// Pass the theme into your ThemeProvider component
render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);
```

Then use themes in your styled components:

```js
import styled from 'styled-components';

const Button = styled.button`
  background-color: ${props => props.theme.primary}
`;

```

## Sweet! What does the output look like?

Given a Sass file with some global variable declarations:

```sass
$primary: rgb(255, 202, 77);
$seondary: #1A93C8;
$primary-light: lighten($primary, 20%);
$base-padding: 10px;
$base-margin: 0 1em;
$base-border: 1px solid #ccc;
$font-family-sans: 'Helvetica', 'Arial', sans-serif;
$base-font-size: 16px;
$line-height: $base-font-size * 1.8;
```

It will yield the following object:

```js
{ 
  primary: 'rgb(255, 202, 77)',
  seondary: 'rgb(26, 147, 200)',
  'primary-light': 'rgb(255, 232, 179)',
  'base-padding': '10px',
  'base-margin': '0 1em',
  'base-border': '1px solid rgb(204, 204, 204)',
  'font-family-sans': '\'Helvetica\', \'Arial\', sans-serif',
  'base-font-size': '16px',
  'line-height': '28.8px'
}
```
## Rad! Can I customize it?

You want options? Sure. The `sassToStyledTheme` function takes an options object as its second parameter.

```js
const theme = sassToStyledTheme(file, { /* options! */ });
```

### Options object

Key | Type | Default | Description
--- | ----- | ------ | -----------
camel | boolean | false | convert output variable names to camelCase
sassOptions | object | | options to pass thru to [node-sass][]

## Help! It's not working for me.

This project is open source. I've tried to make sure it works for a lot of use cases (read: mine) but if I missed yours, feel free to [open an issue][issues]. Better yet, [submit a PR][pr]! Seriously, any feedback and help is welcome.

### Known Issues

This library uses the awesome [sass-extract][] package under the hood to render and parse the Sass. There is currently an issue where mixins or functions that use default values may cause the variable extraction to silently fail ([sass-extract #12](https://github.com/jgranstrom/sass-extract/issues/12)). If you run into this, a workaround is to make sure that you follow the mixin or function with a normal variable declaration.

[issues]: https://github.com/adamgruber/sass-styled-theme/issues
[pr]: https://github.com/adamgruber/sass-styled-theme/pulls
[styled-components]: https://www.styled-components.com/
[theming]: https://www.styled-components.com/docs/advanced#theming
[node-sass]: https://github.com/sass/node-sass#options
[sass-extract]: https://github.com/jgranstrom/sass-extract
