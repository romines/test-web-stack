module.exports = function override(config, env) {
  //do stuff with the webpack config...
  config.ignoreWarnings = [/Failed to parse source map/];
  return config;
}
