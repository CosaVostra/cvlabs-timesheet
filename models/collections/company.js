companyMaster = new Mongo.Collection('companymaster');

var Schema = {}

Schema.companyMaster = new SimpleSchema({
  companyName: {
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
companyMaster.attachSchema(Schema.companyMaster);
