/*
 * Detect profanity in text automatically
 */

const algorithmia = require('algorithmia')

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

    const [err, data] = await to(this._algo.pipe(input))
    if (err)
      throw new Error(err)
    return data.get()
  }
}

module.exports = Algorithmia
