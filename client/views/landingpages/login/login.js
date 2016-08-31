Template.login.rendered = function () {
  $('#login').height($(window).height());
  $('#loginform').parsley();
}
Template.login.helpers({
  user: function () {
    if (Meteor.user()) {
      FlowRouter.go('/');
    }
    else {
      return true;
    }
  }
})
Template.login.events({
  'submit #loginform': function (e) {
    e.preventDefault();
    if ($('#loginform').parsley().validate() == true) {
      Meteor.loginWithPassword($('#txtEmail').val(), $('#txtPassword').val(), function (err ,res) {
        if (err) {
          $('#lblLoginMsg').text(err.message);
        }
        else {
          FlowRouter.go('/');
        }
        setTimeout(function () {
          $('#lblLoginMsg').text('');
        }, 10000);
      })
    }
  }
})

Template.forgotPassword.events({
  'click #btnSubmitEmail': function (e) {
    e.preventDefault();
    if ($('#txtForgotPasswordEmail').parsley().validate() == true) {
      var email = $('#txtForgotPasswordEmail').val();
      Accounts.forgotPassword({email:email}, function (err, res) {
        if (err) {
          console.log(err.message);
          FlashMessages.sendError(err.message);
        }
        else {
          console.log(res);
          FlashMessages.sendSuccess("Please check your mail");
        }
      })
    }
  }
})
