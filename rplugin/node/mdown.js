var fs = require('fs');
var path = require('path');
var md = require('markdown-it');
var hjs = require('highlight.js');
var got = require('got');
var tasklist = require('markdown-it-task-lists');

var util = require('../../lib/util');

var tpl = fs.readFileSync(path.join(__dirname, '../../template.html'), 'utf8');
var theme = "Avenue"
var md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (!lang) return '';
    if (!hjs.getLanguage(lang)) return '';

    try {
      return hljs.highlight(lang, str).value;
    } catch (__) {}
  }
}).use(tasklist);

plugin.functionSync('MdownPreview', preview);
plugin.functionSync('MdownReload', renderAndRefresh);

function render(content, done) {
  return tpl.replace('$cssLink', style(theme)).replace('$body', md.render(content));
}

function style(css){
  var baseUrl = "https://rawgit.com/ttscoff/MarkedCustomStyles/master/";

  var cssUrl = encodeURI(baseUrl + css + '.css');
  var linkElem = "<link rel=\"stylesheet\" type=\"text/css\" href=\"" + cssUrl + "\" media=\"screen\" />";
  return linkElem;

}

function setTheme(args){
  if ( args.length > 0 ){
    return theme=args[0];
  }
}

function renderAndRefresh(nvim, args, done) {
  debug('render and refresh', args);
  setTheme(args)
  util.createServer(function(err) {
    if (err) return done(err);
    markdownFromBuffer(nvim, function(err) {
      if (err) return done(err);
      done();
    });
  });
}

function preview(nvim, args, done) {
  setTheme(args)
  util.createServer(function(err) {
    if (err) return done(err);

    markdownFromBuffer(nvim, function(err) {
      if (err) return done(err);

      util.openBrowser(function(err) {
        debug('opened, all done', err);
        if (err) return done(err);
        done();
      });
    });
  });
}

function markdownFromBuffer(nvim, done) {
  util.getBufferContent(nvim, function(err, content) {
    if (err) return done(err);
    var html = render(content);

    util.setHtml(html);
    refresh(function(err) {
      if (err) return done(err);
      done();
    });
  });
}

function refresh(done) {
  debug('Refresh file');
  got('http://localhost:35729/changed?files=markdown')
    .catch(done)
    .then(function() {
      done();
    });
}
