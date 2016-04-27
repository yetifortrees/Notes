import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { jquery } from 'meteor/jquery';
import './main.html';
var newID = 0;
/**
 * This is a template for the main user table where a paginated
 * form of all of the users can be found, along with basic info
 */
Template.notesSide.onCreated(function onCreate() {
    Session.set("Notes", []);
    Session.set("activeNote", {});
});
//helper functions for the user table
Template.notesSide.helpers({
    //returns all of the users
    Notes() {
      return Session.get("Notes");
    },
    NotesSettings() {
        return {
            showFilter: false,
            rowsPerPage: 10000,
            showNavigation: 'never',
            fields: [
                {key: 'title', label: 'Title'},
                {key: 'lastMod', label: 'Last Modified'}
            ]
        };
    }
});
//this handles the templates events
Template.notesSide.events({
    //if the user clicks a table row that row is set to active
    'click .reactive-table tbody tr': function (event) {
        Session.set('activeNote', this);
        $()
    },
    'click .new-note': function (event) {
        var notes = Session.get("Notes");
        notes.push({title: "new " + newID, id: newID, lastMod: (new Date()).toUTCString()});
        newID += 1;
        Session.set("Notes", notes);
    }
});

//this handles the templates events
Template.notesContent.events({
    'click .menu-toggle': function (event) {
        event.preventDefault();
        $("#wrapper").toggleClass("toggled");
    },
    'click .save-note': function (event) {
        var notes = Session.get("Notes");
        var activeNote = Session.get("activeNote")
        var found = false;
        notes.forEach(function (object, index, array) {
            if (object.id == activeNote.id) {
                found = true;
                activeNote.title = $("#title").val();
                activeNote.content = $("#note-content").val();
                activeNote.lastMod = (new Date()).toUTCString();
                notes[index] = activeNote;
            }
        });
        if (!found) {
            activeNote.title = $("#title").val();
            activeNote.content = $("#note-content").val();
            activeNote.lastMod = (new Date()).toUTCString();
            activeNote.id = newID;
            newID += 1;
            notes.push(activeNote);
        }
        Session.set("activeNote", activeNote);
        Session.set("Notes", notes);
    }
});

Template.notesContent.helpers({
    title() {
        return Session.get("activeNote").title;
    },
    content() {
        return Session.get("activeNote").content;
    }
});