timesheetMaster = new Mongo.Collection('timesheetmaster');

var Schema = {}

Schema.timesheetMaster = new SimpleSchema({
  clientId: {
    type: String,
  },
  projectId: {
    type: String,
    optional: true
  },
  expertisesId: {
    type: String
  },
  userId: {
    type: String
  },
  date: {
    type: Date
  },
  hour: {
    type: Number
  },
  minute: {
    type: Number
  },
  tasks:
  {
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
timesheetMaster.attachSchema(Schema.timesheetMaster);
