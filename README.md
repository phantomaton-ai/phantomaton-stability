# Phantomaton Stability Adapter 🌠

This plugin provides a Stability AI adapter for the Phantomaton Imagination plugin. It allows you to generate images using the Stability AI API.

**NOTE:** This plugin is a placeholder and does not currently implement the Stability AI API.

## Installation 🔮

```
npm install phantomaton-stability
```

## Usage 🕸️

To use this adapter with the Phantomaton Imagination plugin, install it and configure your Phantomaton instance as follows:

```javascript
import imagination from 'phantomaton-imagination';
import stability from 'phantomaton-stability';
import plugins from 'phantomaton-plugins';

export default plugins.create([
  plugins.define(imagination.adapter).as(stability)
]);
```

Then, you can use the `imagine` command:

```markdown
imagine(project:my-project, file:image.png) {
  A cat riding a unicorn
} imagine⚡️
```

## Contributing 🦄

Contributions are welcome!