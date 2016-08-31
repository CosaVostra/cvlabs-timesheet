Schema = {}
Schema.UserProfile = new SimpleSchema({
  firstName: {
    type: String,
    optional: true
  },
  lastName: {
    type: String,
    optional: true
  },
  levelId: {
    type: String,
    optional: true
  },
  jobTitle: {
    type: String,
    optional: true
  },
  userType: {
    type: String,
    optional: true
  }
});

Schema.User = new SimpleSchema({
  emails: {
    type: [Object],
    optional: true
  },
  "emails.$.address": {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  "emails.$.verified": {
    type: Boolean
  },
  companyId: {
    type: String,
    optional: true
  },
  profile: {
    type: Schema.UserProfile,
    optional: true
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true
  },
  password: {
    type: String,
    blackbox: true,
    optional: true
  },
  roles: {
    type: Object,
    optional: true,
    blackbox: true
  },
  isActive: {
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
  },
  updateDate: {
    type: Date,
    autoValue: function () {
      return new Date();
    }
  },
});

Meteor.users.attachSchema(Schema.User);

userTable = {};
Meteor.isClient && Template.registerHelper('userTable', userTable);
userTable.users = new Tabular.Table({
  name:"user",
  collection:Meteor.users,
  processing: false,
  columns: [
    {
      title: 'Company Name',
      data: 'companyId',
      visible:false
    },
    {
      title: 'Name',
      data: 'profile.firstName',
      visible:true,
      render: function (val, type, doc) {
        Session.set("spinner", false);
        return val;
      }
    },
    {
      title: 'Role',
      data: "roles.defaultgroup",
      visible:true
    },
    {
      title: 'Level',
      data: 'profile.levelId',
      visible:true,
      render: function (val) {
        if (val) {
          return levelMaster.findOne({_id: val}).levelName;
        }
      }
    },
    {
      title: 'Job Title',
      data: 'profile.jobTitle',
      visible:false
    },
    {
      title: 'Status',
      data: 'isActive',
      render: function (val, type, doc) {
        if (val) {
          return '<input id="' + doc._id + '" type="checkbox" name="user-checkbox" class="user-status" checked data-size="mini">';
        }
        else {
          return '<input id="' + doc._id + '" type="checkbox" name="user-checkbox" class="user-status" data-size="mini">';
        }
      }
    },
    {
      title: 'Email',
      data: 'emails.0.address',
      visible:false
    },
    {
      title: ' ',
      tmpl: Meteor.isClient && Template.editdeletecontent,
    }
  ],
  initComplete: function (settings, json) {
    Session.set("spinner", false);
  }
})
