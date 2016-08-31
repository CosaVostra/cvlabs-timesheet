Template.levels.rendered = function () {
  Session.set("spinner", true);
  setLevelSwitch();
  $("#levelForm").parsley();
}
Template.levels.helpers({
  'role': function () {
    if (Meteor.user().roles.defaultgroup[0]=="Admin" || Meteor.user().roles.defaultgroup[0]=="Manager" ) {
      return true;
    }
  },
  'switch':function() {
    setLevelSwitch();
    return true;
  }
})
Template.levels.events({
  'draw.dt table':function() {
    setLevelSwitch();
  },
  'submit #levelForm': function (e) {
    e.preventDefault();
    if ($("#levelForm").parsley().validate() == true) {
      var levelName =   $('#txtLevel').val();
      var condition = {"levelName":{ $regex: new RegExp('^' + levelName + '$', "i") }};
      if ($('#hdnLevelId').val() != '')
      {
        condition['_id'] = {
          $ne:$('#hdnLevelId').val()
        }
      }
      var existlevel = levelMaster.find(condition).count()>0
      if (existlevel === true) {
        FlashMessages.sendError('Level already exist.')
        return;
      }
      else {

        if ($('#hdnLevelId').val() != '') {
          var objLevel = {
            id: $('#hdnLevelId').val(),
            name: $('#txtLevel').val(),
            status: $("#" + $('#hdnLevelId').val()).bootstrapSwitch('state')
          }
          Meteor.call('levelUpdate', objLevel, function (err, res) {
            if (err) {
              FlashMessages.sendError(err.message);
            }
            else {
              setLevelSwitch();
              $('#txtLevel').val('');
              $('#hdnLevelId').val('');
              setTimeout(function () {
                FlashMessages.sendSuccess(messages.levelUpdate);
              }, 100);
            }
          })

        }
        else {

          Meteor.call('levelInsert', $('#txtLevel').val(), function (err, res) {
            if (err) {
              FlashMessages.sendError(err.message);
            }
            else {
              setLevelSwitch();
              setTimeout(function () {
                FlashMessages.sendSuccess(messages.levelInsert);
              }, 100);
              $('#txtLevel').val('');
            }
          })
        }
      }
    }
  },

  'click #lnkLevelEdit': function (e) {
    e.preventDefault();
    $('#hdnLevelId').val(this._id);
    $('#txtLevel').val(this.levelName);
  },

  'switchChange.bootstrapSwitch .level-status': function (e) {
    e.preventDefault();
    var objLevel = {
      id: e.target.id,
      name: $(e.target).attr('data'),
      status: $("#" + e.target.id).bootstrapSwitch('state')
    }

    Meteor.call('levelUpdate', objLevel, function (err, res) {
      if (err) {
        FlashMessages.sendError(err.message);
      }
      else {
        setTimeout(function () {
          FlashMessages.sendSuccess(messages.levelUpdate);
        }, 500);
        setLevelSwitch();
      }
    })
  }
})

function setLevelSwitch() {
  setTimeout(function () {
    if (Meteor.user().roles.defaultgroup[0].toLowerCase() == constant.admin.toLowerCase()){
      $("[name='level-checkbox']").bootstrapSwitch({
        onText: 'A',
        offText: 'I'
      });
    }
    else {
      $("[name='level-checkbox']").bootstrapSwitch({
        onText: 'A',
        offText: 'I',
        disabled: true
      });

      $('[id=lnkLevelEdit]').attr('disabled', true);
      $('[id=lnkLevelEdit]').prop('disabled', true);
      $('#btnAddLevel').attr('disabled', true);
      $('#btnAddLevel').prop('disabled', true);
    }
  }, 200)
}
