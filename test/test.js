const path = require('path');
const sassToStyledTheme = require('../index');

const testfiles = {
  basic: path.resolve(__dirname, './sass/test-basic.scss'),
  camel: path.resolve(__dirname, './sass/test-opts-camel.scss'),
  sassOpts: path.resolve(__dirname, './sass/test-opts-sass.scss'),
  import: path.resolve(__dirname, './sass/test-import.scss'),
};

describe('sassToStyledTheme', () => {
  it('should convert basic SASS vars', () => {
    expect(sassToStyledTheme(testfiles.basic)).toMatchSnapshot();
  });

  it('should convert keys to camelCase', () => {
    expect(sassToStyledTheme(testfiles.camel, { camel: true })).toMatchSnapshot();
  });

  it('should handle imports', () => {
    expect(sassToStyledTheme(testfiles.import)).toMatchSnapshot();
  });

  it('should pass sass options through', () => {
    const opts = {
      sassOptions: {
        includePaths: [path.join(__dirname, 'sass', 'nested')],
      },
    };
    expect(sassToStyledTheme(testfiles.sassOpts, opts)).toMatchSnapshot();
  });
});
