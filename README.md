# Phantomaton Stability Adapter 🌠

The Phantomaton Stability Adapter allows the Phantomaton AI to generate images using the Stability AI API, bringing your wildest text prompts to life!

## Installation 🔮

To install this plugin, use the following incantation:

```
npm install phantomaton-stability
```

## Usage 🕸️

To unleash the power of Stability AI image generation within [Phantomaton](https://github.com/phantomaton-ai/phantomaton), simply install the module:

```markdown
/install(module:phantomaton-stability)
```

To enable this and other plugins in your system prompt, you can edit `.phantomaton/configuration.json` to expose their commands.

### Configuration ⚙️

The Stability Adapter requires an API key to access the Stability AI API. You can obtain an API key from [https://platform.stability.ai/](https://platform.stability.ai/).

You can configure the API key and home directory (where generated images are stored) when defining the plugin:

```javascript
import imagination from 'phantomaton-imagination';
import stability from 'phantomaton-stability';
import plugins from 'phantomaton-plugins';

const apiKey = 'YOUR_STABILITY_API_KEY';
const home = 'path/to/your/image/directory';

export default plugins.create(({ configuration }) => [
  plugins.define(imagination.adapter).as(stability({ apiKey, home }))
]);
```

**Note:** Replace `YOUR_STABILITY_API_KEY` with your actual Stability AI API key.

### Using the `imagine` Command

Once the adapter is installed and configured, your assistant will have access to the `imagine` command:

```markdown
imagine(project:my-project, file:image.png) {
  A cat riding a unicorn
} imagine⚡️
```

This will generate an image based on the prompt "A cat riding a unicorn" and save it to `image.png` in the `my-project` project.

## Contributing 🦄

We welcome contributions to the Phantomaton Stability project! If you have any ideas, bug reports, or pull requests, please feel free to submit them. Just be sure to follow all coding style guidelines.