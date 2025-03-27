import { expect } from 'lovecraft';
import util from './util.js';
import fetch from 'node-fetch';
import { v4 } from 'uuid';

describe('util', () => {
  it('does re-export fetch and uuid', () => {
    expect(util.fetch).to.eq(fetch);
    expect(util.uuid).to.eq(v4);
  });
});