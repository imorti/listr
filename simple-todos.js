// simple-todos.js
Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
    // Replace the existing Template.body.helpers
    Template.body.helpers({
	  tasks: function () {
	    if (Session.get("hideCompleted")) {
	      // If hide completed is checked, filter tasks
	      return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
	    } else {
	      // Otherwise, return all of the tasks
	      return Tasks.find({}, {sort: {createdAt: -1}});
	    }
	  },
	  hideCompleted: function () {
	    return Session.get("hideCompleted");
	  },

	  // Add to Template.body.helpers
      incompleteCount: function () {
         return Tasks.find({checked: {$ne: true}}).count();
      }
	});

	  // Inside the if (Meteor.isClient) block, right after Template.body.helpers:
	Template.body.events({
	  "submit .new-task": function (event) {

	    var text = event.target.text.value;

	    Tasks.insert({
	      owner: Meteor.userId(),
	      username: Meteor.user().username, //username of logged in user
	      text: text,
	      createdAt: new Date() // current time
	    });

	    // Clear form
	    event.target.text.value = "";

	    // Prevent default form submit
	    return false;
	  },

	  // Add to Template.body.events
	  "change .hide-completed input": function (event) {
		  Session.set("hideCompleted", event.target.checked);
	  }


	});

	// In the client code, below everything else
	Template.task.events({
	  "click .toggle-checked": function () {
	    // Set the checked property to the opposite of its current value
	    Tasks.update(this._id, {$set: {checked: ! this.checked}});
	  },
	  "click .delete": function () {
	    Tasks.remove(this._id);
	  }
	});

	// At the bottom of the client code
    Accounts.ui.config({
      passwordSignupFields: "USERNAME_ONLY"
    });
}


