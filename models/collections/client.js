clientMaster = new Mongo.Collection('clientmaster');

var Schema = {}

Schema.clientMaster = new SimpleSchema({
  clientName: {
    type: String
  },
  companyId: {
    type: String,
    autoValue: function () {
      return Meteor.user().companyId;
    }
  },
  status: {
    type: Boolean,
    autoValue: function (doc) {
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
clientMaster.attachSchema(Schema.clientMaster);

clientTable = {};
Meteor.isClient && Template.registerHelper('clientTable', clientTable);
clientTable.clientMaster = new Tabular.Table({
  name:"Client Master",
  collection:clientMaster,
  columns: [
    {
      title: 'clientId',
      data: '_id',
      visible: false
    },
    {
      title: 'Client Name',
      data: 'clientName'
    },
    {
      title: 'Projects',
      data: '_id',
      render: function (val) {
        return projectMaster.find({clientId: val}).count();
      }
    },
    {
      title: 'Status',
      data: 'status',
      // render: function (val) {
      //   // return '<input type="checkbox" name="my-checkbox" checked>';
      // }
    },
    {
      title: 'Add Project',
      tmpl: Meteor.isClient && Template.addProject
    }
  ]
})
