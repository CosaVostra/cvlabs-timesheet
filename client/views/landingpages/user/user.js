Template.userManagement.rendered = function () {
  Session.set("spinner", true);
  document.title = 'Add User';
  $("#userForm").parsley();
  var useridval = FlowRouter.getParam('_userId');
  if(useridval == "add")
  {
    $("#btnSubmit").text("Add");
  }
  else {
    $("#btnSubmit").text("Update");
  }
}

Template.usercontent.rendered = function () {
  document.title = 'User';
  setUserSwitch();

}

Template.userManagement.onCreated(function () {
  leveldata = new ReactiveVar();
  roledata = new ReactiveVar();
});

Template.userManagement.helpers({
  leveldata: function() {
    return levelMaster.find({status: true}).fetch();
  },

  roledata: function() {
    return rolearray;
  },

  'switch':function() {
    setUserSwitch();
    return true;
  },

  'companyName': function () {
    setTimeout(function () {
      $('#txtcompanyName').val(companyMaster.findOne().companyName)
    }, 10);
    return companyMaster.findOne().companyName;
  },

  'data': function () {
    var userData = Meteor.users.findOne({_id: FlowRouter.getParam('_userId')});
    if (userData) {
      return userData;
    }
    else {
      return true;
    }
  },

  'address': function(emails) {
    if (emails) {
      return emails[0].address;
    }
  },

  'selectedLevel': function (key) {
    return key == this._id ? 'selected' : '';
  },

  'selectedRole': function (key) {
    return key[0].toLowerCase() == this.name.toLowerCase() ? 'selected' : '';
  },
  user: function () {
    if (Meteor.user().roles.defaultgroup[0] == 'Employee') {
      return false;
    }
    else {
      return true;
    }
  }
});

Template.usercontent.helpers({
  'userSelector': function () {
    return {companyId: Meteor.user().companyId};
  },
  user: function () {
    if (Meteor.user().roles.defaultgroup[0] == 'Employee') {
      return false;
    }
    else {
      return true;
    }
  }
})

Template.usercontent.events({
  'draw.dt table':function() {
      setUserSwitch();
  },
  "click #btnaddUser": function(e, t) {
    e.preventDefault();
    FlowRouter.go('/' + Meteor.user().companyId + '/user/'+'add' );
  },

  "click #lnkedit": function(e, t) {
    FlowRouter.go('/' + Meteor.user().companyId + '/user/'+ this._id );
  },

  'switchChange.bootstrapSwitch .user-status': function (e) {
    e.preventDefault();
    var obj = {
      id: e.target.id,
      isActive: $("#" + e.target.id).bootstrapSwitch('state')
    }
    Meteor.call('statusUpdate', obj, function (err, res) {
      if (err) {
        FlashMessages.sendError(err.message);
      }
      else {
        setTimeout(function () {
          FlashMessages.sendSuccess('Record Updated Succesfully!');
        }, 500);
        setUserSwitch();
      }
    })
  }
})

Template.userManagement.events({
  'submit #userForm': function(event){
    event.preventDefault();
    if ($("#userForm").parsley().validate() == true) {
      var obj =
      {
        firstName : $('#txtfirstName').val(),
        lastName : $('#txtlastName').val(),
        email : $('#txtemail').val(),
        levelId : $('#drplevel').val(),
        jobTitle : $('#txtjobTitle').val(),
        userType:$('#drpuserType').val()
      };

      var useridval = FlowRouter.getParam('_userId');
      if(useridval == "add") {
        var hdnuserid = '';
        Meteor.call('userInsert',obj, function(error, res) {
          if (error) {
            FlashMessages.sendError(error.toString());
            return;
          }
          else {
            var companyId = Meteor.user().companyId;
            var companyName = companyMaster.findOne().companyName;
            FlashMessages.sendSuccess('Record Inserted Succesfully!');
            Meteor.call('companyID',res);
            var objEmail = {
              to: obj.email,
              subject: 'Invitation',
              text: invitationTemplate.text.replace('{{companyName}}', companyName)
              .replace('{{companyId}}', companyId)
              .replace('{{userId}}', res)
            }
            Meteor.call('sendEmail', objEmail)
            FlowRouter.go( '/' + Meteor.user().companyId + '/user');
          }
        });
      }
      else {
        useridval = FlowRouter.getParam('_userId');
        Meteor.call('userUpdate',useridval,obj, function(error, result) {
          if (error) {
            FlashMessages.sendError(error.toString());
            return;
          }
          else {
            FlashMessages.sendSuccess('Record Updated Succesfully!');
            FlowRouter.go( '/' + Meteor.user().companyId + '/user');
          }
        });
      }
    }
  },

  "click #lnknavigation": function(e, t) {
    FlowRouter.go( '/' + Meteor.user().companyId + '/user');
  }
});

function setUserSwitch() {
  setTimeout(function () {
    if (Meteor.user().roles.defaultgroup[0].toLowerCase() == constant.admin.toLowerCase()) {
      $("[name='user-checkbox']").bootstrapSwitch({
        onText: 'A',
        offText: 'I'
      });
    }
    else {
      $("[name='user-checkbox']").bootstrapSwitch({
        onText: 'A',
        offText: 'I',
        disabled: true
      });

      $('[id=lnkedit]').attr('disabled', true);
      $('[id=lnkedit]').prop('disabled', true);
      $('[id=lnkdelete]').attr('disabled', true);
      $('[id=lnkdelete]').prop('disabled', true);
      $('#btnaddUser').attr('disabled', true);
      $('#btnaddUser').prop('disabled', true);
    }
  }, 300)
}
