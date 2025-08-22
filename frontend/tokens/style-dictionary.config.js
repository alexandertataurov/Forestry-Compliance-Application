const StyleDictionary = require('style-dictionary');

// Custom transform for CSS custom properties
StyleDictionary.registerTransform({
  name: 'custom/css',
  type: 'value',
  matcher: function(prop) {
    return prop.attributes.category === 'color' || 
           prop.attributes.category === 'typography' ||
           prop.attributes.category === 'spacing' ||
           prop.attributes.category === 'radius' ||
           prop.attributes.category === 'elevation' ||
           prop.attributes.category === 'motion' ||
           prop.attributes.category === 'opacity' ||
           prop.attributes.category === 'breakpoint';
  },
  transformer: function(prop) {
    return prop.value;
  }
});

// Custom transform for CSS custom properties with kebab-case naming
StyleDictionary.registerTransform({
  name: 'custom/css-variables',
  type: 'name',
  transformer: function(prop) {
    return prop.path.join('-').toLowerCase();
  }
});

// Custom transform for Tailwind CSS format
StyleDictionary.registerTransform({
  name: 'custom/tailwind',
  type: 'value',
  matcher: function(prop) {
    return prop.attributes.category === 'color' || 
           prop.attributes.category === 'spacing' ||
           prop.attributes.category === 'radius' ||
           prop.attributes.category === 'elevation' ||
           prop.attributes.category === 'motion' ||
           prop.attributes.category === 'opacity' ||
           prop.attributes.category === 'breakpoint';
  },
  transformer: function(prop) {
    // Convert pixel values to rem for Tailwind
    if (typeof prop.value === 'string' && prop.value.includes('px')) {
      const numValue = parseFloat(prop.value);
      if (!isNaN(numValue)) {
        return `${numValue / 16}rem`;
      }
    }
    return prop.value;
  }
});

module.exports = {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transforms: ['custom/css-variables', 'custom/css'],
      buildPath: 'styles/',
      files: [
        {
          destination: 'design-tokens.css',
          format: 'css/variables',
          options: {
            outputReferences: true,
            selector: ':root'
          }
        }
      ]
    },
    tailwind: {
      transforms: ['custom/tailwind'],
      buildPath: 'tokens/',
      files: [
        {
          destination: 'tailwind-tokens.json',
          format: 'json'
        }
      ]
    },
    scss: {
      transforms: ['custom/css-variables', 'custom/css'],
      buildPath: 'styles/',
      files: [
        {
          destination: 'design-tokens.scss',
          format: 'scss/variables',
          options: {
            outputReferences: true
          }
        }
      ]
    }
  }
};
