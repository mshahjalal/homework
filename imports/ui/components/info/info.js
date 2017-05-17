import { Links } from '/imports/api/links/links.js';
import { Meteor } from 'meteor/meteor';
import './info.html';

Template.info.onCreated(function () {
  Meteor.subscribe('links.all');
  Meteor.subscribe('users.all');
});

Template.info.helpers({
  links() {
    return Links.find({});
  },
  getUserList(){
	  return Meteor.users.find();
  },
  isLoggedIn(){
	  return Meteor.userId();
  }
});

Template.info.events({
  'submit .info-link-add'(event) {
    event.preventDefault();

    const target = event.target;
    const title = target.title;
    const url = target.url;

    Meteor.call('links.insert', title.value, url.value, (error) => {
      if (error) {
        alert(error.error);
      } else {
        title.value = '';
        url.value = '';
      }
    });
  },
  'submit .add-post-form'(event) {
    event.preventDefault();

    const target = event.target;
    const newPost = target.postmessage;

    Meteor.call('postToFacebok', newPost.value, function(error, result) {
      if (error) {
        console.log(error.error);
      } else {
        console.log("Post id: ", result);
      }
    });
  },
  'click .facebook-user-data'(event){
	  Meteor.call('getFacebokUserData', function(error, result) {
      if (error) {
        console.log(error.error);
      } else {
        console.log("Data: ", result);
      }
    });
  },
  'click .facebook-user-picture'(event) {
    Meteor.call('getFacebokUserPicture', function(error, result) {
      if (error) {
        console.log(error.error);
      } else {
        console.log("facebook user picture: ", result);
      }
    });
  },
  'click .facebook-user-profile'(event){
	  Meteor.call('getUserProfileInfoAndFriendsInfo', function(error, result) {
      if (error) {
        console.log(error.error);
      } else {
        console.log("facebook user and friends: ", result);
      }
    });
  }
});
