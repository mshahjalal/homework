// Methods related to links

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Links } from './links.js';
import { Messages } from './messages.js';

Meteor.methods({
  'links.insert'(title, url) {
    check(url, String);
    check(title, String);

    return Links.insert({
      url,
      title,
      createdAt: new Date(),
    });
  },
  'postToFacebok'(wallPostMessage) {
        var graph = require('fbgraph'),
		userInfo = Meteor.users.findOne(Meteor.userId());
		
		if(userInfo && userInfo.services.facebook.accessToken) {
          graph.setAccessToken(userInfo.services.facebook.accessToken);
		  graph.setVersion("2.9");	  
		  
		  graph.post(userInfo.services.facebook.id + "/feed?access_token="+userInfo.services.facebook.accessToken, {message:wallPostMessage}, function(err, res) {
				if(err) return err;
				else return res.id; //returns the post id
				//console.log(res); 
			});
		}
		else return false;        
    },
	'getFacebokUserData'(){
		var graph = require('fbgraph'),
		userInfo = Meteor.users.findOne(Meteor.userId());
		
		if(userInfo && userInfo.services.facebook.accessToken) {
			
          graph.setAccessToken(userInfo.services.facebook.accessToken);
		  graph.setVersion("2.9");	 
		  
			var options = {
				timeout:  3000,
			    pool:     { maxSockets:  Infinity },
			    headers:  { connection:  "keep-alive" }
			};

			graph
				.setOptions(options)
				.get(userInfo.services.facebook.id, function(err, res) {
				console.log(res); 
			});
		}
		else return false;  
	},
	'getFacebokUserPicture'(){
		var graph = require('fbgraph'),
		userInfo = Meteor.users.findOne(Meteor.userId());
		
		if(userInfo && userInfo.services.facebook.accessToken) {
          graph.setAccessToken(userInfo.services.facebook.accessToken);
		  graph.setVersion("2.9");
		  
			return graph.get(userInfo.services.facebook.id, { fields: "picture" },  function(err, res) {
			  console.log(res); 
			});
		}
		else return false;  
	},
	'getUserProfileInfoAndFriendsInfo'(){
		var graph = require('fbgraph'),
		userInfo = Meteor.users.findOne(Meteor.userId());
		
		if(userInfo && userInfo.services.facebook.accessToken) {
          graph.setAccessToken(userInfo.services.facebook.accessToken);
		  graph.setVersion("2.9");
			
			graph.batch([
				{
					method: "GET",
					relative_url: "me" 
				},
				{
					method: "GET",
					relative_url: "me/friends?limit=50" 
				}
			], function(err, res) {
				console.log(res);
			});
		}
		else return false;  
		
	},
	getUserInfoUsingFqlQuery(){
		var graph = require('fbgraph'),
		userInfo = Meteor.users.findOne(Meteor.userId());
		
		if(userInfo && userInfo.services.facebook.accessToken) {
          graph.setAccessToken(userInfo.services.facebook.accessToken);
		  graph.setVersion("2.9");
		  
		  var query = {
				name: "SELECT name FROM user WHERE uid = me()",
				permissions: "SELECT email, user_about_me, user_birthday FROM permissions WHERE uid = me()"
			};

			graph.fql(query, function(err, res) {
			  console.log(res);
			  if(err) return err;
			  else return res;
			});
		}		
	},
	sendTextMessage(messageText){
		var messageInfo = Messages.findOne(),
			messageData = {
				recipient: messageInfo.recipient,
				message: {
				  text: messageText
				}
			};

	  callSendAPI(messageData);
	}
});

function callSendAPI(messageData) {
  HTTP.call('POST','https://graph.facebook.com/v2.9/me/messages', {
		data: {
			access_token: "EAAJGb0Uv6ZBYBAO2BAhHzpPqKhb6gGHVPZBMxsIzr8krgHZA3TGWTbe2Lbp8FMcz0mCyF1hjQnlA6axsauNtSHoZCvz737A4ZA8ZCrpLAmPaijxrnREnlcPcYlnGBxxq0R5HXn24UsbbLkpUu9T71lHHbM2XLR78MLTGaBjZAtMsQZDZD"
		},
		json: messageData
	}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
		  var recipientId = body.recipient_id;
		  var messageId = body.message_id;

		  console.log("Successfully sent generic message with id %s to recipient %s", messageId, recipientId);
		} else {
		  console.error("Unable to send message.");
		  console.error(response);
		  console.error(error);
		}
  });  
}
