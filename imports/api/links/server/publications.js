// All links-related publications

import { Meteor } from 'meteor/meteor';
import { Links } from '../links.js';
import { Messages } from '../messages.js';

Meteor.publish('links.all', function () {
  return Links.find();
});

Meteor.publish('users.all', function () {
  return Meteor.users.find();
});

Meteor.publish('messages.all', function () {

  return Messages.find();
});