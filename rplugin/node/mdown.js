var fs = require('fs');
var path = require('path');
var md = require('markdown-it');
var hjs = require('highlight.js');
var got = require('got');
var tasklist = require('markdown-it-task-lists');
var deflists = require('markdown-it-deflist')

var util = require('../../lib/util');

var tpl = fs.readFileSync(path.join(__dirname, '../../template.html'), 'utf8');
var theme = "Avenue"
var themeRepoUrl = "https://cdn.rawgit.com/bncoelho/MarkedCustomStyles/master/";

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
}).use(tasklist).use(deflists);

plugin.functionSync('MdownPreview', preview);
plugin.functionSync('MdownReload', renderAndRefresh);

function render(content, done) {
  return tpl.replace('$cssLink', style(theme)).replace('$body', md.render(content));
}

function style(css){
  var cssUrl = encodeURI(themeRepoUrl + css + '.css');
  return "<link rel=\"stylesheet\" type=\"text/css\" href=\"" + cssUrl + "\" media=\"screen\" />";
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
