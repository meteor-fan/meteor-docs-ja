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

/* jshint undef: true, unused: true, latedef: true */
/* jshint quotmark: single, eqeqeq: true */
/* jshint node: true */

var fs = require('fs');
var path = require('path');
var cheerio = require('cheerio');

function normalize(str) {
  return str.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
}

function loadTranslations() {
  var target = {};
  fs.readdirSync('translations').forEach(function(file) {
    if (!/\.json$/.test(file)) return;
    var tag = /^\w+/.exec(file);
    if (!target[tag]) target[tag] = {};
    var content = fs.readFileSync(path.join('translations', file), 'utf8');
    var translation = JSON.parse(content);
    Object.keys(translation).forEach(function(key) {
      target[tag][normalize(key)] = translation[key];
    });
  });
  return target;
}

var translations = loadTranslations();

function getTranslatedText(tag, text) {
  var targetKey = normalize(text);
  Object.keys(translations[tag] || {}).forEach(function(key) {
    if (targetKey === key) {
      text = translations[tag][key];
    }
  });
  return text;
}

function translate(file) {
  var content = fs.readFileSync(path.join('sources', file), 'utf8');
  var $ = cheerio.load(content);
  ['p', 'strong', 'dt', 'dd'].forEach(function(tag) {
    $(tag).each(function() {
      $(this).html(getTranslatedText(tag, $(this).html()));
    });
  });
  fs.writeFileSync(file, $.html(), 'utf8');
}

fs.readdirSync('sources').forEach(translate);
