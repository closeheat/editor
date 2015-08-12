var Editor, React;

React = require('react/addons');

Editor = require('./editor');

module.exports = React.createClass({
  renderEditor: function() {
    var content;
    content = fs.readFileSync("/" + (this.path())).toString();
    return React.createElement(Editor, {
      "value": content,
      "path": this.path(),
      "onChange": this.props.editorChange
    });
  },
  isFile: function() {
    return !!this.path();
  },
  path: function() {
    return this.props.params.splat;
  },
  renderFileManager: function() {
    console.log('file mamager');
    return React.createElement("div", null);
  },
  render: function() {
    if (this.isFile()) {
      return this.renderEditor();
    } else {
      return this.renderFileManager();
    }
  }
});
