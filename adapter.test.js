import { expect, stub } from 'lovecraft';
import fs from 'fs';
import path from 'path';

import Adapter from './adapter.js';
import util from './util.js';

describe('Adapter', () => {
  let fetchStub, createWriteStreamStub, uuidStub;
  const apiKey = 'test-api-key';
  const prompt = 'A cat riding a unicorn';

  beforeEach(() => {
    fetchStub = stub(util, 'fetch');
    createWriteStreamStub = stub(fs, 'createWriteStream');
    uuidStub = stub(util, 'uuid').returns('test-uuid');

    const mockResponse = {
      body: {
        pipe: stub().returnsThis(),
        on: stub().callsFake((event, callback) => {
          if (event === 'finish') {
            callback();
          }
        })
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
  });

  afterEach(() => {
    fetchStub.restore();
    createWriteStreamStub.restore();
    uuidStub.restore();
  });

  it('calls the Stability AI API and save the image to a file with defaults', async () => {
    const adapter = new Adapter({ apiKey }); // No home provided
    const imagePath = await adapter.imagine(prompt);

    const expectedFilename = path.join('data/images', 'test-uuid.png');
    expect(fs.createWriteStream.lastCall.args[0]).to.eq(expectedFilename);
    expect(imagePath).to.eq(expectedFilename);
  });

  it('calls the Stability AI API and save the image to a file with custom home', async () => {
    const home = 'custom-images';
    const adapter = new Adapter({ apiKey, home }); // Custom home provided
    const imagePath = await adapter.imagine(prompt);

    const expectedFilename = path.join(home, 'test-uuid.png');
    expect(fs.createWriteStream.lastCall.args[0]).to.eq(expectedFilename);
    expect(imagePath).to.eq(expectedFilename);
  });

  it('calls the Stability AI API with custom width/height from options', async () => {
    const width = 1234;
    const height = 100;
    const adapter = new Adapter({ apiKey, width, height }); // Custom height/width
    await adapter.imagine(prompt);

    expect(fetchStub.callCount).to.eq(1);
    expect(JSON.parse(fetchStub.lastCall.args[1].body)).to.deep.eq({
      text_prompts: [{text: prompt, weight: 1}],
      height,
      width
    });
  });

  it('calls the Stability AI API with custom width/height from parameters', async () => {
    const width = 1234;
    const height = 100;
    const adapter = new Adapter({ apiKey }); // Custom height/width
    await adapter.imagine(prompt, { width, height });

    expect(fetchStub.callCount).to.eq(1);
    expect(JSON.parse(fetchStub.lastCall.args[1].body)).to.deep.eq({
      text_prompts: [{text: prompt, weight: 1}],
      height,
      width
    });
  });
});
