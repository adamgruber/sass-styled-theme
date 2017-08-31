const sassExtract = require('sass-extract');
const camelCase = require('camel-case');

/*
 * Add escaped quotes around font names other than the generic CSS font families
 * While quotes are not required, they are recommended by the spec
 * https://www.w3.org/TR/css-fonts-3/#generic-font-families
 *
 * @param {string} str Font family name
 *
 * @return {string}
 */
function quoteFontName(str) {
  const genericFonts = [
    'serif',
    'sans-serif',
    'cursive',
    'fantasy',
    'monospace',
  ];
  return genericFonts.includes(str.toLowerCase()) ? str : `'${str}'`;
}

/*
 * Get the CSS value from a sass-extract data structure
 * https://github.com/jgranstrom/sass-extract#general-variable-value-structure
 *
 * @param {object}  sassVar    Abstract data structure for SASS variable
 * @param {object}  opts       Options to pass through to `transformStyles`
 * @param {boolean} opts.camel Convert vars to camelCase
 *
 * @return {string|int} CSS value
 */
function getSassValue(sassVar, opts) {
  const { type, value } = sassVar;
  switch (type) {
    case 'SassString':
    case 'SassBoolean':
    case 'SassNull':
      return value;

    case 'SassNumber':
      return sassVar.unit ? `${value}${sassVar.unit}` : value;

    case 'SassColor': {
      const { r, g, b, a } = value;
      const hasAlpha = a !== 1;
      return hasAlpha
        ? `rgba(${r.toFixed()}, ${g.toFixed()}, ${b.toFixed()}, ${a})`
        : `rgb(${r.toFixed()}, ${g.toFixed()}, ${b.toFixed()})`;
    }

    case 'SassList': {
      const isStringList = value.every(item => item.type === 'SassString');
      const newList = value.map(getSassValue);
      return isStringList
        ? newList.map(quoteFontName).join(', ')
        : newList.join(' ');
    }

    case 'SassMap':
      return transformStyles(value, opts);

    default:
      return value;
  }
}

/*
 * Transform style object key
 * - Strip leading '$'
 * - Convert to camelCase if `camel` is true
 *
 * @param {string}  key   Style object key
 * @param {boolean} camel Should keys be converted to camelCase
 *
 * @return {string} Converted key
 */
function transformKey(key, camel) {
  const newKey = key.replace('$', '');
  return camel ? camelCase(newKey, null, true) : newKey;
}

/*
 * Reduce SASS-compiled styles object into theme object
 *
 * @param {object} stylesObj Output from `sass-extract` render
 * @param {object} opts Options
 *
 * @return {object} Transformed styles object
 */
function transformStyles(stylesObj, opts) {
  return Object.keys(stylesObj).reduce((acc, key) => {
    const newKey = transformKey(key, opts.camel);
    const newVal = getSassValue(stylesObj[key], opts);
    acc[newKey] = newVal;
    return acc;
  }, {});
}

/*
 * Convert SASS variables to JS object that can
 * be used as a theme for styled-components
 *
 * @param {string}  file             Absolute path to SASS file with variables to be converted
 * @param {object}  opts             Options object
 * @param {object}  opts.sassOptions Options to pass to node-sass
 *
 * @return {object} Transformed styles object
 */
function styledSassTheme(file, opts = {}) {
  const { sassOptions } = opts;
  const sassOpts = Object.assign((sassOptions || {}), { file });

  const { vars } = sassExtract.renderSync(sassOpts);
  const globalStyles = vars.global || {};
  return transformStyles(globalStyles, opts);
}

module.exports = styledSassTheme;
