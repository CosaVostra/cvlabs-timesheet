projectMaster = new Mongo.Collection('projectmaster');

var Schema = {}

Schema.creditLines = new SimpleSchema({
  _id: {
    type: Number
  },
  hours: {
    type: Number
  },
  createDate: {
    type: Date,
    optional: true,
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

Schema.budgetLines = new SimpleSchema({
  _id: {
    type: Number
  },
  levelId: {
    type: String
  },
  days: {
    type: Number
  },
  createDate: {
    type: Date,
    optional: true,
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

Schema.projectMaster = new SimpleSchema({
  clientId: {
    type: String
  },
  clientName: {
    type: String,
    optional: true
  },
  projectName: {
    type: String
  },
  maintenance: {
    type: Boolean
  },
  budgetLines: {
    type: [Schema.budgetLines]
  },
  creditLines: {
    type: [Schema.creditLines],
    optional: true
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
    optional: true,
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
projectMaster.attachSchema(Schema.projectMaster);
