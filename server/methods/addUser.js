Meteor.methods({
  "userInsert":function (obj) {
    var roles = [];
    if(obj.userType){
      roles.push(obj.userType);
    }
    var hdnuserid;
    hdnuserid = Accounts.createUser({
      email: obj.email,
      profile: {
        firstName : obj.firstName,
        lastName : obj.lastName,
        levelId : obj.levelId,
        jobTitle : obj.jobTitle,
        userType:obj.userType,
      }
    });

    if (roles.length > 0) {
      Roles.addUsersToRoles(hdnuserid, roles, 'defaultgroup');
    }
    return hdnuserid;
  },

  "userUpdate":function (useridval, obj) {
    var roles = [];
    if(obj.userType){
      roles.push(obj.userType);
    }
    hdnuserid = Meteor.users.update(useridval, {$set:
      {
        'emails.0.address': obj.email,
        companyId: obj.companyId,
        profile: {
          firstName : obj.firstName,
          lastName : obj.lastName,
          levelId : obj.levelId,
          jobTitle : obj.jobTitle,
          userType:obj.userType
        },
        roles: {
          defaultgroup: roles
        }
      }
    });
  },
  statusUpdate: function (values) {
    Meteor.users.update(values.id, {$set: {
      isActive: values.isActive
    }}, function (err ,res) {
      if (err) {
        console.log(err.message);
      }
    })
  },

  "userDelete":function(id) {
    Meteor.users.remove(id);
  },

  "companyID":function(hdnuserid) {
    Meteor.users.update(hdnuserid, {$set: {
      companyId: Meteor.user().companyId
    }})
  },

  sendEmail: function (values) {
    this.unblock();
    var toEmail = '';

    Email.send({
      to: values.to,
      from: "support@timesheet.com",
      subject: values.subject,
      html: values.text
    }, function (err, res) {
      if (err) {
        console.log(err);
      }
      else {
        console.log(res);
      }
    });
  },

  updateUserPassword: function (values) {
    Accounts.setPassword(values.userId, values.userPassword, function (err ,res) {
      if (err) {
        console.log(err.message);
      }
      else {
        console.log(res);
      }
    });
  }
});
