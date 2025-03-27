import { expect, stub } from 'lovecraft';
import fs from 'fs';
import path from 'path';
import hierophant from 'hierophant';

import stabilityPlugin from './phantomaton-stability.js';
import Adapter from './adapter.js';
import util from './util.js';
import imagination from 'phantomaton-imagination';

describe('phantomaton-stability', () => {
  let fetchStub, createWriteStreamStub, uuidStub;
  const apiKey = 'test-api-key';
  const home = 'test-images';

  beforeEach(() => {
    fetchStub = stub(util, 'fetch');
    createWriteStreamStub = stub(fs, 'createWriteStream');
    uuidStub = stub(util, 'uuid').returns('test-uuid');
  });

  afterEach(() => {
    fetchStub.restore();
    createWriteStreamStub.restore();
    uuidStub.restore();
  });

  it('does register the adapter and call the Stability AI API when imagine is called', async () => {
    const prompt = 'A cat riding a unicorn';
    const mockResponse = {
      body: {
        pipe: stub().returnsThis(),
        on: stub()
      }
    };
    fetchStub.resolves(mockResponse);
    createWriteStreamStub.returns({
      on: stub().callsFake((event, callback) => {
        if (event === 'finish') {
          callback();
        }
      })
    });

    // Create a hierophant container
    const container = hierophant();

    // Install the phantomaton-stability plugin
    const plugin = stabilityPlugin({ apiKey, home });
    plugin.install.forEach(component => container.install(component));

    //Install phantomaton-imagination
    const imaginationPlugin = imagination();
    imaginationPlugin.install.forEach(component => container.install(component));

    // Resolve the imagination.adapter from the container
    const [adapter] = container.resolve(imagination.adapter.resolve);

    // Call the imagine method on the resolved adapter
    const imagePath = await adapter.imagine(prompt);

    expect(util.fetch.lastCall.args).deep.eq([
      'https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image',
      {
        body: JSON.stringify({
          text_prompts: [{ text: prompt, weight: 1.0 }],
          height: 960,
          width: 1344
        }),
        headers: {
          Accept: 'image/png',
          Authorization: apiKey,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      }
    ]);

    const expectedFilename = path.join(home, 'test-uuid.png');
    expect(fs.createWriteStream.lastCall.args[0]).to.eq(expectedFilename);
    expect(imagePath).to.eq(expectedFilename);
  });
});