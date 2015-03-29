_ = require 'lodash'
Promise = require 'bluebird'
# opbeat = require('opbeat')(
#   organizationId: '1979aa4688cb49b7962c8658bfbc649b'
#   appId: 'c19a8164de'
#   secretToken: 'f12b94d66534f8cc856401008ddd06b627bc5d53'
#   clientLogLevel: 'fatal'
#   active: 'true'
# )

module.exports =
class Core
  constructor: (api_token) ->

  load: ->
    console.log 'loading'

new Core().load()
