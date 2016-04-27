import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { jquery } from 'meteor/jquery';
import './main.html';
var newID = 0;

//what to do when created
Template.notesSide.onCreated(function onCreate() {
    Session.set("Notes", []);
    Session.set("activeNote", {});
});
//helper functions for the Notes navigation table
Template.notesSide.helpers({
    //returns all of the notes
    Notes() {
      return Session.get("Notes");
    },
    //formats the notes table
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
    },
    //if the user clicks the new note button then a new note is generated
    'click .new-note': function (event) {
        var notes = Session.get("Notes");
        notes.push({title: "new " + newID, id: newID, lastMod: (new Date()).toUTCString()});
        newID += 1;
        Session.set("Notes", notes);
    }
});

//this handles the templates events
Template.notesContent.events({
    //if the side bar menu is toggled
    'click .menu-toggle': function (event) {
        event.preventDefault();
        $("#wrapper").toggleClass("toggled");
    },
    //if the save note button is pressed
    'click .save-note': function (event) {
        var notes = Session.get("Notes");
        var activeNote = Session.get("activeNote")
        var found = false;
        //find out which note we are and save it
        notes.forEach(function (object, index, array) {
            if (object.id == activeNote.id) {
                found = true;
                activeNote.title = $("#title").val();
                activeNote.content = $("#note-content").val();
                activeNote.lastMod = (new Date()).toUTCString();
                notes[index] = activeNote;
            }
        });
        //if we didn't find a note then we're a new note somehow
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
    },
    //if the save note button is pressed
    'click .delete-note': function (event) {
        var notes = Session.get("Notes");
        var activeNote = Session.get("activeNote");
        //find out which note we are and save it
        var toDelete = -1;
        notes.forEach(function (object, index, array) {
            if (object.id == activeNote.id) {
                toDelete = index;
            }
        });
        if (toDelete != -1) notes.splice(toDelete, 1);
        console.log(notes);
        Session.set("activeNote", {});
        Session.set("Notes", notes);
    }
});
//helper functions for the note editor
Template.notesContent.helpers({
    title() {
        return Session.get("activeNote").title;
    },
    content() {
        return Session.get("activeNote").content;
    }
});