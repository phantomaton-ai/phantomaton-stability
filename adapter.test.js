import { expect, stub } from 'lovecraft';
import fs from 'fs';
import path from 'path';

import Adapter from './adapter.js';
import util from './util.js';

describe('Adapter', () => {
  let fetchStub, createWriteStreamStub, uuidStub;
  const apiKey = 'test-api-key';

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

  it('calls the Stability AI API and save the image to a file with default home', async () => {
    const prompt = 'A cat riding a unicorn';
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

    const adapter = new Adapter({ apiKey }); // No home provided
    const imagePath = await adapter.imagine(prompt);

    const expectedFilename = path.join('data/images', 'test-uuid.png');
    expect(fs.createWriteStream.lastCall.args[0]).to.eq(expectedFilename);
    expect(imagePath).to.eq(expectedFilename);
  });

  it('calls the Stability AI API and save the image to a file with custom home', async () => {
    const prompt = 'A cat riding a unicorn';
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

    const home = 'custom-images';
    const adapter = new Adapter({ apiKey, home }); // Custom home provided
    const imagePath = await adapter.imagine(prompt);

    const expectedFilename = path.join(home, 'test-uuid.png');
    expect(fs.createWriteStream.lastCall.args[0]).to.eq(expectedFilename);
    expect(imagePath).to.eq(expectedFilename);
  });
});