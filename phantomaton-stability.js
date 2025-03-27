import plugins from 'phantomaton-plugins';
import stabilityAdapter from './stability-adapter.js';

const plugin = plugins.create([
  plugins.define({adapter: {}}).as(stabilityAdapter)
]);

export default plugin;