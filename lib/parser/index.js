/// <reference path="../../typings/node/node.d.ts"/>
'use strict';

var config = require('../config');
var http = require('http');
var debug = require('debug')('dre-parsers');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
var PassThrough = require('stream').PassThrough;
var util = require('util');
var StringDecoder = require('string_decoder').StringDecoder;

var childs = [];
var count = 0;

var parse_servers = [{
    server: 'localhost',
    port: 9615
}];

/* */
var split = require('split');
var cms2fhir = require('cms-fhir');
var cda2fhir = require('cda-fhir');
/* */

function fix_dbg_port() {
    if (process._debugPort) {
        process._debugPort += (cluster.isMaster) ? 1 : 2 + cluster.worker.id;
    }
}

function createServer() {
    return http.createServer(function (req, res) {
        if (req.method === 'POST') {
            if (req.headers.bearer !== (config.secret || config.defaultSecret)) {
                res.statusCode = 401;
                res.end();
                return;
            }

            if (cluster.worker) {
                debug("Worker " + cluster.worker.id + " pid is " + process.pid + " serving request " + (++count));
            }

            var stream;
            if (req.headers['content-type'] === 'text/xml') {
                stream = req.pipe(new cda2fhir.CcdaParserStream());
            } else {
                stream = req
                    .pipe(split())
                    .pipe(new cms2fhir.CmsFile2Object())
                    .pipe(new cms2fhir.IntObjToFhirStream());

            }

            stream.on('data', function (data) {
                    var body = new Buffer(JSON.stringify(data));
                    res.writeHead(200, {
                        'Content-Length': body.length,
                        'Content-Type': 'application/json'
                    });

                    res.end(body);
                    debug((cluster && cluster.worker) ? "Worker " + cluster.worker.id + " pid is " + process.pid + " done    request " + count : ("Pid is " + process.pid));
                })
                .on('error', function (error) {
                    debug(error);
                    res.writeHead(400, {
                        'Content-Type': 'application/json'
                    });
                    res.end(error);
                });

        } else {
            if (cluster.worker) {
                res.end("Worker " + cluster.worker.id + " " + process.pid + ".");
            } else {
                res.end("Master.");
            }
        }
    });
}

/**
 * @function
 * Lunch a set of services on a shared port, number of servces equals number of CPU cores.
 * @param {Nuber} port - default 9615
 */
var lunch = function (port) {
    var i;
    if (cluster.isMaster) {
        fix_dbg_port();
        for (i = 0; i < numCPUs; i++) {
            childs.push(cluster.fork());
        }
    } else {
        fix_dbg_port();
        debug("Started " + cluster.worker.id + " pid is " + process.pid);
        createServer().listen(port || config.port || config.defaultPort);
    }
};

if (require.main === module) {
    // Called directly, so spawn childs and create server

    lunch();

} else {
    // Used as module, export configuration
    exports = module.exports = {
        lunch: lunch,
        createServer: createServer
    };
}
