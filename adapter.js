import fs from 'fs';
import path from 'path';

import util from './util.js';

export default class Adapter {
  constructor({ apiKey, home, height, width }) {
    this.apiKey = apiKey;
    this.home = home || 'data/images';
    this.width = width || 1344;
    this.height = height || 960;
  }

  async imagine(prompt, parameters = {}) {
    const payload = {
      text_prompts: [{ text: prompt, weight: 1.0 }],
      height: parameters.height || this.height || 960,
      width: parameters.width || this.width || 1344
    };

    const fetched = await util.fetch(
      'https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image',
      {
        body: JSON.stringify(payload),
        headers: {
          Accept: 'image/png',
          Authorization: this.apiKey,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      }
    );
    const filename = path.join(this.home, `${util.uuid()}.png`);
    const stream = fs.createWriteStream(filename);
    await new Promise((resolve, reject) => {
      fetched.body.pipe(stream);
      fetched.body.on('error', reject);
      stream.on('finish', resolve);
    });
    return filename;
  }
}
