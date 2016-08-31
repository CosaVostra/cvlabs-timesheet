companyUserMaster = new Mongo.Collection('companyUsermaster');

var Schema = {}

Schema.companyUserMaster = new SimpleSchema({
  userId: {
    type: String
  },
  companyId: {
    type: String
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
companyUserMaster.attachSchema(Schema.companyUserMaster);

companyUserTable = {};
Meteor.isClient && Template.registerHelper('companyUserTable', companyUserTable);
companyUserTable.companyUserMaster = new Tabular.Table({
  name:"CompanyUSer Master",
  collection:companyUserMaster,
  columns: [
    {
      title: 'UserId',
      data: 'userId',
      visible: false
    },
    {
      title: 'CompanyId',
      data: 'companyId'
    }
  ]
})
