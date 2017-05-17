// Methods related to links

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Links } from './links.js';

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
		
	}
});
