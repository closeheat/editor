assert = require "assert"
expect = require "expect.js"

React = require "react/addons"
PreviewMode = require "../src/preview_mode"
Loader = require "../src/loader"

TestUtils = React.addons.TestUtils
shallowRenderer = TestUtils.createRenderer()

describe 'PreviewMode', =>
  shallowRenderer.render(<PreviewMode />)
  result = shallowRenderer.getRenderOutput()

  it 'should show loading', =>
    assert.deepEqual result.props,
      title: 'Hang in tight.'
      subtitle: 'Building your page preview...'
