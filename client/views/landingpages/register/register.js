Template.register.rendered = function () {
  $('#register').height($(window).height());
  $('#registerForm').parsley();
}

Template.register.events({
  'submit #registerForm': function (e) {
    e.preventDefault();
    var companyName = $('#txtCompanyName').val();
    var value = '';
    if ($('#registerForm').parsley().validate() == true) {
      Meteor.call('checkCompany', companyName, function (err, res) {
        if (err) {
          $('#lblRegisterMsg').text(err.message);
        }
        else {
          if (res.length == 0) {
            Accounts.createUser({
              email:  $('#txtEmail').val(),
              password: $('#txtPassword').val(),
            }, function (err ,res) {
              if (err) {
                $('#lblRegisterMsg').text(err.message);
              }
              else {
                Meteor.call('companyInsert', companyName, function (err, res) {
                  if (err) {
                    $('#lblRegisterMsg').text(err.message);
                  }
                  else{
                    FlowRouter.go('/');
                  }
                })
              }
            })
          }
          else {
            $('#lblRegisterMsg').text('Company alredy exists.');
          }
        }
      })

    }
  }
})
