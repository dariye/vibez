/*
 * Detect profanity in text automatically
 */

const algorithmia = require('algorithmia')
const to = require('../utils/to');
class Algorithmia {
  constructor(key, options) {
    this._client = algorithmia.client(key)
    if (options && !options.algo) throw new Error('provide valid algo')
  }

  set client(key) {
    if (!key) throw new Error('provide valid key')
    this._client = algorithmia.client(key)
  }

  set algo({ algo }) {
    if (!algo) throw new Error('provide valid algo')
    this._algo = algo
  }

  get algo() {
    return this._client.algo(this._algo)
  }

  get client() {
    return this._client
  }

  async injest(input = []) {
    if (input.length === 0 || input.length < 3)
      throw new Error('Invalid input value')
    const response = await algorithmia.client('simrE39h1bLAJ0IclMcKSFFt1il1')
      .algo("nlp/ProfanityDetection/1.0.0")
      .pipe(input)
    return response.get()
  }
}

module.exports = Algorithmia
