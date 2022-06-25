'use strict';

var _ = require('lodash');
var base = require('./base');
var types = require('../types');
var util = require('../util');

if (typeof XMLHttpRequest === 'undefined') {
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
}

var API_KEY = 'LKKvFDCW1dGq7B34ZZGVT3BlbkFJRiOxtZWbiBybMCHEBqz3'

var GPT3 = base.makeDistributionType({
  name: 'GPT3',
  desc: 'Sample from GPT-3',
  params: [{name: 'prompt'},
             {name: 'max_tokens'},
             {name: 'temperature'}],
  handlesContinuation: true,
  sample: function(s, k) {
    // console.log('-- sample s is ---')
    // console.log(s)
    // console.log('-- sample k is ---')
    // console.log(k)
    // console.log('---')
    // console.trace()
    var url = 'https://api.openai.com/v1/engines/text-davinci-002/completions';

    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer sk-' + API_KEY);

    var requestBody = {
      prompt: this.params.prompt,
      max_tokens: this.params.max_tokens || 30,
      temperature: this.params.temperature || 0
    };

    xhr.send(JSON.stringify(requestBody));

    xhr.onerror = function(e) {
      console.log('=== xhr error ===')
      return k(s, { 'error': xhr.statusText });
    }

    xhr.onload = function(e) {
      if (xhr.readyState === 4) {
        console.log('=== ready state 4 ===')
        if (xhr.status === 200) {
            // console.log(xhr.responseText);
          var response = JSON.parse(xhr.responseText)
          console.log('==== Calling continuation A ====')
          //console.log(k.toString())
          return k(s, response['choices'][0]['text']);
        } else {
          console.log('==== Calling continuation B with error ====')
          console.error(xhr.statusText);
          return k(s, { 'error': xhr.statusText });
        }
      }
    }
      
    // window.xhrResponse = xhr;
  },
  score: function(val) {
    return 1;
  },
});

module.exports = {
  GPT3: GPT3
};
