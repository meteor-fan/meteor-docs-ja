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

/* global document */

var fs = require('fs');
var path = require('path');
var url = require('url');
var Nightmare = require('nightmare');
var cheerio = require('cheerio');

function processResult(name) {
  return function(result) {
    // a dirty hack to fix bare text nodes
    var bareTextNodes = [
      'Whenever the indicated event happens on the selected element, the\ncorresponding event handler function will be called with the relevant DOM\nevent object and template instance. See the [Event Maps section](#eventmaps)\nfor details.',
      'We\'ve written our fair share of single-page JavaScript applications by hand.\nWriting an entire application in one language (JavaScript) with one\ndata format (JSON) is a real joy.  Meteor is everything we wanted\nwhen writing those apps.'
    ];
    bareTextNodes.forEach(function(text) {
      result = result.replace(text, '<p>' + text + '</p>');
    });

    var $ = cheerio.load(result);
    var versionEle = $('#site-nav select.version-select option');
    if (!versionEle.length) {
      versionEle = $('h1');
    }
    var version = /\d\.(?:\d\.){0,2}\d/.exec(versionEle.text());

    var baseUrl;
    if (name.lastIndexOf('guide', 0) === 0) { // name.startsWith('guide')
      baseUrl = 'http://guide.meteor.com';
    } else {
      baseUrl = 'http://docs.meteor.com';
    }

    $('link').each(function() {
      $(this).attr('href', url.resolve(baseUrl, $(this).attr('href')));
    });
    $('img').each(function() {
      $(this).attr('src', url.resolve(baseUrl, $(this).attr('src')));
    });
    $('a').each(function() {
      var oldHref = $(this).attr('href');
      if (oldHref) {
        $(this).attr('href', oldHref.replace(/\?__hstc=[\w\.]+&__hssc=[\w\.]+&__hsfp=[\w\.]+/, ''));
      }
    });

    if (name.lastIndexOf('guide', 0) === 0) { // name.startsWith('guide')
      $('a').each(function() {
        var oldHref = $(this).attr('href');
        if (oldHref) {
          var oldPath = oldHref.match(/^([\w\-]+)\.html$/);
          if (oldPath) {
            if (oldPath[1] === 'index') {
              oldPath = '';
            } else {
              oldPath = '-' + oldPath[1];
            }
            $(this).attr('href', 'guide' + oldPath + '-' + version + '.html');
          }
        }
      });
    } else { // basic, full
      $('h2, h3, h4').each(function() {
        var oldId = $(this).attr('id');
        if (oldId) {
          $(this).attr('id', '/' + name + '/' + oldId);
        }
      });
    }

    $('script').remove();
    $('.hidden').remove();
    $('.basic-or-full option[value!="' + name + '"]').remove();
    fs.writeFileSync(path.join('sources', name + '-' + version + '.html'), $.html(), 'utf8');
  };
}

Nightmare()
  .goto('http://docs.meteor.com/')
  .wait(1000)
  .select('.basic-or-full', 'basic')
  .wait(500)
  .evaluate(function() {
    return document.documentElement.outerHTML; //jshint ignore:line
  }, processResult('basic'))
  .select('.basic-or-full', 'full')
  .evaluate(function() {
    return document.documentElement.outerHTML; //jshint ignore:line
  }, processResult('full'))
  .goto('http://guide.meteor.com/')
  .evaluate(function() {
    return document.documentElement.outerHTML; //jshint ignore:line
  }, processResult('guide'))
  .goto('http://guide.meteor.com/collections.html')
  .evaluate(function() {
    return document.documentElement.outerHTML; //jshint ignore:line
  }, processResult('guide-collections'))
  .goto('http://guide.meteor.com/data-loading.html')
  .evaluate(function() {
    return document.documentElement.outerHTML; //jshint ignore:line
  }, processResult('guide-data-loading'))
  .goto('http://guide.meteor.com/methods.html')
  .evaluate(function() {
    return document.documentElement.outerHTML; //jshint ignore:line
  }, processResult('guide-methods'))
  .goto('http://guide.meteor.com/routing.html')
  .evaluate(function() {
    return document.documentElement.outerHTML; //jshint ignore:line
  }, processResult('guide-routing'))
  .goto('http://guide.meteor.com/accounts.html')
  .evaluate(function() {
    return document.documentElement.outerHTML; //jshint ignore:line
  }, processResult('guide-accounts'))
  .goto('http://guide.meteor.com/ui-ux.html')
  .evaluate(function() {
    return document.documentElement.outerHTML; //jshint ignore:line
  }, processResult('guide-ui-ux'))
  .goto('http://guide.meteor.com/blaze.html')
  .evaluate(function() {
    return document.documentElement.outerHTML; //jshint ignore:line
  }, processResult('guide-blaze'))
  .goto('http://guide.meteor.com/security.html')
  .evaluate(function() {
    return document.documentElement.outerHTML; //jshint ignore:line
  }, processResult('guide-security'))
  .goto('http://guide.meteor.com/deployment.html')
  .evaluate(function() {
    return document.documentElement.outerHTML; //jshint ignore:line
  }, processResult('guide-deployment'))
  .goto('http://guide.meteor.com/build-tool.html')
  .evaluate(function() {
    return document.documentElement.outerHTML; //jshint ignore:line
  }, processResult('guide-build-tool'))
  .run();
