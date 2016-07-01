/*
  Copyright (C) 2015, Daishi Kato <daishi@axlight.com>
  All rights reserved.

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
  "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
  LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
  A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
  HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
  SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
  OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var fs = require('fs');
var path = require('path');
var cheerio = require('cheerio');
var he = require('he');

function normalize(str) {
  return str.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
}

var translations = {
  p: {},
  strong: {},
  dt: {},
  dd: {},
  h1: {},
  h2: {},
  h3: {},
  h4: {},
  em: {},
  li: {},
  pre: {}
};

function saveJsonFiles() {
  Object.keys(translations).forEach(function(tagName) {
    var file = tagName + '-generated.json';
    var content = JSON.stringify(translations[tagName], null, 2);
    fs.writeFileSync(path.join('translations', file), content, 'utf8');
  });
}

function generate(file) {
  if (!/\.html$/.test(file)) return;
  var content = fs.readFileSync(path.join('work', file), 'utf8');
  var $ = cheerio.load(content);
  $('.translation').each(function() {
    var element = $(this);
    var original = element.prev();
    var targetKey = normalize(original.html());
    var text = element.html();
    text = text.replace(/&#x\w{4};/g, function(match) {
      return he.decode(match);
    });
    translations[this.tagName][targetKey] = text;
  });
}

fs.readdirSync('work').forEach(generate);
saveJsonFiles();
