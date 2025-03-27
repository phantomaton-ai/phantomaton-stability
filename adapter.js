import fs from 'fs';
import path from 'path';

import util from './util.js';

export default class Adapter {
  constructor({ apiKey, home }) {
    this.apiKey = apiKey;
    this.home = home || 'data/images';
  }

  async imagine(prompt) {
    const payload = {
      text_prompts: [{
        text: prompt,
        weight: 1.0
      }],
      height: 960,
      width: 1344
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