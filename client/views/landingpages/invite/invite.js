userEmail = '';

Template.invite.helpers({
  userInfo: function () {
    $('#invite').height($(window).height());
    $('#inviteForm').parsley();
    userEmail = Meteor.users.findOne({_id: FlowRouter.getParam('_userId')}).emails[0].address;
    var companyName = companyMaster.findOne().companyName;
    if (userEmail && companyName) {
      return {userEmail: userEmail, companyName:companyName};
    }
    else {
      return false;
    }
  },

  companyName: function () {
  }
})

Template.invite.events({
  'submit #inviteForm': function (e) {
    e.preventDefault();
    if ($('#inviteForm').parsley().validate() == true) {
      var password = $('#txtUserPassword').val();
      objUser = {
        userId: FlowRouter.getParam('_userId'),
        userPassword: password
      }
      Meteor.call('updateUserPassword', objUser, function (err, res) {
        if (err) {
          $('#lblInviteMsg').text(err.message);
        }
        else {
          Meteor.loginWithPassword(userEmail, password, function (err, res) {
            if (err) {
              $('#lblInviteMsg').text(err.message);
            }
            else {
              FlowRouter.go('/');
            }
          });
        }
        setTimeout(function () {
          $('#lblInviteMsg').text('');
        }, 10000);
      })
    }
  }
})
