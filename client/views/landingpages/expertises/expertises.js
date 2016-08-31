Template.expertises.rendered = function () {
  Session.set("spinner", true);
  setExpertisesSwitch();
  $("#expertisesForm").parsley();
}
Template.expertises.helpers({
  'role': function () {
    if (Meteor.user().roles.defaultgroup[0]=="Admin" || Meteor.user().roles.defaultgroup[0]=="Manager" ) {
      return true;
    }
  },
  'switch':function() {
    setExpertisesSwitch();
    return true;
  }
})
Template.expertises.events({
  'draw.dt table':function() {
      setExpertisesSwitch();
  },
  'submit #expertisesForm': function (e) {
    e.preventDefault();
    if ($("#expertisesForm").parsley().validate() == true) {
      var expertisesName =   $('#txtExpertises').val().trim();
      var condition = {"expertisesName":{ $regex: new RegExp('^' + expertisesName + '$', "i") }};
      if ($('#hdnExpertisesId').val() != '')
      {
        condition['_id'] = {
          $ne:$('#hdnExpertisesId').val()
        }
      }
      var existExpertises = expertisesMaster.find(condition).count()>0
      if (existExpertises === true) {
        FlashMessages.sendError('Expertise already exist.')
        return;
      }
      else {
        if ($('#hdnExpertisesId').val() != '') {
          var obj = {
            id: $('#hdnExpertisesId').val(),
            name: $('#txtExpertises').val(),
            status: $("#" + $('#hdnExpertisesId').val()).bootstrapSwitch('state')
          }
          Meteor.call('expertisesUpdate', obj, function (err ,res) {
            if (err) {
              setTimeout(function () {
                FlashMessages.sendError(err.message);
              }, 100);
            }
            else {
              setExpertisesSwitch();
              $('#txtExpertises').val('');
              $('#hdnExpertisesId').val('');
              setTimeout(function () {
                FlashMessages.sendSuccess(messages.expertisesUpdate);
              }, 100);
            }
          })
        }
        else {
          Meteor.call('expertisesInsert', $('#txtExpertises').val(), function (err ,res) {
            if (err) {
              FlashMessages.sendError(err.message);
            }
            else {
              setExpertisesSwitch();
              setTimeout(function () {
                FlashMessages.sendSuccess(messages.expertisesInsert);
              }, 100);
              $('#txtExpertises').val('');
            }
          })
        }
      }
    }
  },

  'click #lnkExpertisesEdit': function (e) {
    e.preventDefault();
    $('#hdnExpertisesId').val(this._id);
    $('#txtExpertises').val(this.expertisesName);
  },

  'switchChange.bootstrapSwitch .expertises-status': function (e) {
    e.preventDefault();
    var obj = {
      id: e.target.id,
      name: $(e.target).attr('data'),
      status: $("#" + e.target.id).bootstrapSwitch('state')
    }

    Meteor.call('expertisesUpdate', obj, function (err, res) {
      if (err) {
        FlashMessages.sendError(err.message);
      }
      else {
        setTimeout(function () {
          FlashMessages.sendSuccess(messages.levelUpdate);
        }, 500);
        setExpertisesSwitch();
      }
    })
  }
})

function setExpertisesSwitch() {
  setTimeout(function () {
    if (Meteor.user().roles.defaultgroup[0].toLowerCase() == constant.admin.toLowerCase()){
      $("[name='expertises-checkbox']").bootstrapSwitch({
        onText: 'A',
        offText: 'I'
      });
    }
    else {
      $("[name='expertises-checkbox']").bootstrapSwitch({
        onText: 'A',
        offText: 'I',
        disabled: true
      });

      $('[id=lnkExpertisesEdit]').attr('disabled', true);
      $('[id=lnkExpertisesEdit]').prop('disabled', true);
      $('#btnAddExpertises').attr('disabled', true);
      $('#btnAddExpertises').prop('disabled', true);
    }
  }, 200)
}
