import { expect, stub } from 'lovecraft';
import fs from 'fs';
import path from 'path';
import * as uuid from 'uuid';

import util from './util.js';
import Adapter from './adapter.js';

describe('Phantomaton Stability Plugin', () => {
  let fetchStub, createWriteStreamStub, uuidStub;
  const apiKey = 'test-api-key';
  const home = 'test-images';
  let adapter;

  beforeEach(() => {
    fetchStub = stub(util, 'fetch');
    createWriteStreamStub = stub(fs, 'createWriteStream');
    uuidStub = stub(util, 'uuid').returns('test-uuid');
    adapter = new Adapter({ apiKey, home });
  });

  afterEach(() => {
    fetchStub.restore();
    createWriteStreamStub.restore();
    uuidStub.restore();
  });

  it('calls the Stability AI API and saves the image to a file', async () => {
    const prompt = 'A cat riding a unicorn';
    const mockResponse = {
      body: {
        pipe: stub().returnsThis(),
        on: stub().yields()
      }
    };
    fetchStub.resolves(mockResponse);
    createWriteStreamStub.returns({
      on: stub().yields()
    });

    const imagePath = await adapter.imagine(prompt);

    expect(fetchStub).toHaveBeenCalledWith(
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
    );

    const expectedFilename = path.join(home, 'test-uuid.png');
    expect(createWriteStreamStub).toHaveBeenCalledWith(expectedFilename);
    expect(imagePath).to.eq(expectedFilename);
  });
});