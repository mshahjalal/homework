// Import server startup through a single index entry point

import './fixtures.js';
import './register-api.js';
import { Picker } from 'meteor/meteorhacks:picker';

var graph = require('fbgraph');
//const Messages = new Mongo.Collection('fb_messages');


//console.log("webhook test....");


var bodyParser = Meteor.npmRequire( 'body-parser' );

Picker.middleware( bodyParser.json() );
Picker.middleware( bodyParser.urlencoded( { extended: false } ) );

var getRoutes = Picker.filter(function(req, res) {
  return req.method == "GET";
});

getRoutes.route('/webhook', function(params, req, res, next) {
  if (params.query['hub.verify_token'] === 'token' && params.query['hub.mode'] === 'subscribe') {
        console.log(params.query['hub.verify_token']);
        // res.end();
        res.end(params.query['hub.challenge']);
  }
});

var postRoutes = Picker.filter(function(req, res) {
  return req.method == "POST";
});

postRoutes.route('/webhook', function(params, req, res, next) {
	var data = req.body;
  
	if (data.object === 'page' && data.entry) {
		_.each(data.entry || [], function(entryInfo){
			if(entryInfo){
				var pageID = entryInfo.id,
				timeOfEvent = entryInfo.time;
				
				if(entryInfo.messaging){
					_.each(entryInfo.messaging || [], function(messages){
						if (messages.message) {
							receivedMessage(messages, pageID, timeOfEvent);
						}
					});
				}
			}			
		});
	}	
	
	res.end();
});

var receivedMessage = function(messageInfo, pageID, time) {
	messageInfo.pageId = pageID;
	messageInfo.time = time;
	
	console.log("Message data: ", messageInfo);
	
	if(_.size(messageInfo)){
		var messageId = Messages.insert(messageInfo);
		console.log("messageId: ", messageId);
	}	
};