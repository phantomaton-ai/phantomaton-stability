import imagination from 'phantomaton-imagination';
import plugins from 'phantomaton-plugins';

import Adapter from './adapter.js';

const plugin = plugins.create(({ configuration }) => [
  plugins.define(imagination.adapter).as(new Adapter(configuration))
]);

export default plugin;