expertisesMaster = new Mongo.Collection('expertisesmaster');

var Schema = {}

Schema.expertisesMaster = new SimpleSchema({
  expertisesName: {
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
expertisesMaster.attachSchema(Schema.expertisesMaster);

expertisesTable = {};
Meteor.isClient && Template.registerHelper('expertisesTable', expertisesTable);
expertisesTable.expertisesMaster = new Tabular.Table({
  name:"Expertises Master",
  collection:expertisesMaster,
  processing: false,
  columns: [
    {
      title: 'ExpertisesId',
      data: '_id',
      visible: false
    },
    {
      title: 'Expertises',
      data: 'expertisesName',
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
          return '<input id="' + doc._id + '" type="checkbox" name="expertises-checkbox" class="expertises-status" data="' + doc.expertisesName + '" checked data-size="mini">';
        }
        else {
          return '<input id="' + doc._id + '" type="checkbox" name="expertises-checkbox" class="expertises-status" data="' + doc.expertisesName + '" data-size="mini">';
        }
      }
    },
    {
      title: 'Edit/Delete',
      tmpl: Meteor.isClient && Template.editExpertises
    }
  ],
  initComplete: function (settings, json) {
    setTimeout(function () {
      Session.set("spinner", false);
    }, 10);
  }
})
