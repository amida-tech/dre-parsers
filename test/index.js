/// <reference path="../typings/mocha/mocha.d.ts"/>
/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/mocha/mocha.d.ts"/>
/// <reference path="../typings/supertest/supertest.d.ts""/>
/// <reference path="../typings/superagent/superagent.d.ts"/>
'use strict';

var expect = require('chai').expect;
var supertest = require('supertest');
var deploymentLocation = 'http://' + 'localhost' + ':' + '9615';
var extend = require('util')._extend;
var api = supertest.agent(deploymentLocation);
var fs = require('fs');
var path = require('path');
var url = require('url');

var https = require('https');

var xml;
var txt;
var mess = '---------------------------\n\n Have no idea howto interpret this!\n-------------\n???????????\n\-----------------';

function testCDA(done) {
  
    api.post('/').set('Bearer', 'No Secret!').set('Content-Type','text/xml').send(xml).end(function (err, res) {
        if (err) {
              console.log('got err!');
            return done(err);
        }
        if(res.body.id !== 'urn:hl7ii:2.16.840.1.113883.19.5.99999.1:TT988') {
            done('Wrong body id!');
        }
        done();
    });
}

function testCMS(done) {
  
    api.post('/').set('Bearer', 'No Secret!').set('Content-Type','text/plain').send(txt).end(function (err, res) {
        if (err) {
              console.log('got err!');
            return done(err);
        }

        if(res.body.resourceType !== 'Bundle') {
            done('Wrong body type!');
        }
        done();
    });
}

function testMessCDA(done) {
  
    api.post('/').set('Bearer', 'No Secret!').set('Content-Type','text/xml').send(mess).end(function (err, res) {
        if (err) {
              console.log('got err!');
            return done(err);
        }
        if(res.body.id !== 'urn:hl7ii:2.16.840.1.113883.19.5.99999.1:TT988') {
            done('Wrong body id!');
        }
        done();
    });
}

function testMessCMS(done) {
  
    api.post('/').set('Bearer', 'No Secret!').set('Content-Type','text/plain').send(mess).end(function (err, res) {
        if (err) {
              console.log('got err!');
            return done(err);
        }

        if(res.body.resourceType !== 'Bundle') {
            done('Wrong body type!');
        }
        done();
    });
}

before("Getting test CCDA", function (done) {


    fs.readFile('test/artifacts/bluebutton-01-original.xml', 'utf8', function (err,data) {
  if (err) {
    return done(err);
  }

  xml = data;
  done();
});

});

before("Getting test CMS", function (done) {


    fs.readFile('test/artifacts/sample.txt', 'utf8', function (err,data) {
  if (err) {
    return done(err);
  }

  txt = data;
  done();
});

});

describe("Test CCDA multiple upload", function () {
    it("feed service with data (1)", function (done) {
        testCDA(done);
    });
    it("feed service with data (2)", function (done) {
        testCDA(done);
    });
    it("feed service with data (3)", function (done) {
        testCDA(done);
    });
    it("feed service with data (4)", function (done) {
        testCDA(done);
    });
    it("feed service with data (5)", function (done) {
        testCDA(done);
    });
    it("feed service with data (6)", function (done) {
        testCDA(done);
    });
});

describe("Test CMS multiple upload", function () {
    it("feed service with data (1)", function (done) {
        testCMS(done);
    });
    it("feed service with data (2)", function (done) {
        testCMS(done);
    });
    it("feed service with data (3)", function (done) {
        testCMS(done);
    });
    it("feed service with data (4)", function (done) {
        testCMS(done);
    });
    it("feed service with data (5)", function (done) {
        testCMS(done);
    });
    it("feed service with data (6)", function (done) {
        testCMS(done);
    });
});

describe("Test buggy upload", function () {
    it("feed CMS with data mess", function (done) {
        testMessCMS(done);
    });
    it("feed CDA with data mess", function (done) {
        testMessCDA(done);
    });
});
