var EventEmitter = require('events').EventEmitter
, util = require('util')
, WebSocket = require('ws')
, request = require('request')
, qrystr = require('querystring').stringify
, config = require('../config.js');

var Marketstem = function(opts){
	var self = this;
	EventEmitter.call(self);
	self.opts = opts;
	self.ws = new WebSocket(config.marketstem_uri);
	self._bindMessageHandler();
};

util.inherits(Marketstem, EventEmitter);

var method_uri_map = {
	'assets':'assets',
	'assetAliases':'assets/aliases',
	'markets':'markets',
	'exchanges':'exchanges',
	'exchangeAssets':'exchanges/assests',
	'exchangeMarkets':'exchanges/markets',
	'aggregateTicker':'aggregate/ticker',
};

for (method in method_uri_map){
	(function(method){
		Marketstem.prototype[method] = function(data, cb){
			this._getReq(method_uri_map[method], data, cb);
		};
	})(method);
}

Marketstem.prototype._apiRoot = 'http://marketstem.com/api/';

Marketstem.prototype._getReq = function(path, data, cb){
	if (!cb) {
		cb = data;
		data = {};
	}
	var url = this._apiRoot+path+'?'+qrystr(data);
	request(url, function(err, resp, body){
		try{
			body = JSON.parse(body);
			return cb(err, body);
		} catch(e){
			return cb(e);
		}
	});
};

Marketstem.prototype.sendEvent = function(event, data){
	this.ws.send(JSON.stringify({ event: event, data: data }));
};

Marketstem.prototype.subscribe = function(channel, cb){
	var self = this;
	self.ws.on('open', function(){
		self.sendEvent('pusher:subscribe', {channel:channel});
	});
};

Marketstem.prototype._bindMessageHandler = function(){
	var self = this;
	self.ws.on('message', function(message){
		var parsed_message = self._parseMessage(message);
		parsed_message && parsed_message.forEach(function(m){
			self.emit('data', m);
		});
	});
};

Marketstem.prototype._parseMessage = function(message, flags) {
	var self = this;
	try{
		message = JSON.parse(message)
		if (!message.data) return false;
		try{
			return JSON.parse(message.data);
		} catch(e){return false;}
	} catch(e){return false;}
};

module.exports = Marketstem;
