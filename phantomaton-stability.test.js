import { expect } from 'lovecraft';
import stabilityAdapter from './adapter.js';

describe('stabilityAdapter', () => {
  it('does call the imagine method and return a path', async () => {
    const prompt = 'A cat riding a unicorn';
    const imagePath = await stabilityAdapter.imagine(prompt);
    expect(imagePath).to.be.a('string');
    expect(imagePath).to.not.be.empty;
  });
});