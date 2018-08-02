const { send, json } = require('micro')
const { router, get, post }  = require('microrouter')

module.exports = router(
  get('/', (req, res) => {
    return send(res, 200, 'API Home')
  })
)
