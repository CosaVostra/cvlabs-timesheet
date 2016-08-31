levelMaster = new Mongo.Collection('levelmaster');

var Schema = {}

Schema.levelMaster = new SimpleSchema({
  levelName: {
    type: String
  },
  status: {
    type: Boolean,
    autoValue: function () {
      if (this.isInsert) {
        return true;
      }
    }
  },
  createDate: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      }
    }
  },
  updateDate: {
    type: Date,
    autoValue: function () {
      return new Date();
    }
  }
})
levelMaster.attachSchema(Schema.levelMaster);

levelTable = {};
Meteor.isClient && Template.registerHelper('levelTable', levelTable);
levelTable.levelMaster = new Tabular.Table({
  name:"Level Master",
  collection:levelMaster,
  processing: false,
  columns: [
    {
      title: 'LevelId',
      data: '_id',
      visible: false
    },
    {
      title: 'LevelName',
      data: 'levelName',
      render: function (val, type, doc) {
        Session.set("spinner", false);
        return val;
      }
    },
    {
      title: 'Status',
      data: 'status',
      render: function (val, type, doc) {
        if (val) {
          return '<input id="' + doc._id + '" type="checkbox" name="level-checkbox" class="level-status" data="' + doc.levelName + '" checked data-size="mini">';
        }
        else {
          return '<input id="' + doc._id + '" type="checkbox" name="level-checkbox" class="level-status" data="' + doc.levelName + '" data-size="mini">';
        }
      }
    },
    {
      title: 'Edit/Delete',
      tmpl: Meteor.isClient && Template.editLevel
    }
  ],
  initComplete: function (settings, json) {
    // note this method never seems to be called!
    // doc: https://datatables.net/reference/option/initComplete
    setTimeout(function () {
      Session.set("spinner", false); // flag to hide spinner after first data has loaded
    }, 10);
  }
})
