Template.client.onCreated(function () {
  _clientData = new ReactiveVar([]);
})

Template.client.rendered = function () {
  getClientData();
  $('#clientForm').parsley();
}

Template.client.helpers({
  'clientData': function () {
    return _clientData.get();
  },

  'checkedSwitch': function (status) {
    return status ? 'checked' : '';
  },

  'role': function () {
    if (Meteor.user().roles.defaultgroup[0]=="Admin" || Meteor.user().roles.defaultgroup[0]=="Manager" ) {
      return true;
    }
  },

  'switch':function() {
    getClientData();
    return true;
  }
})

Template.client.events({
  'draw.dt table':function() {
      getClientData();
  },
  'submit  #clientForm': function (e) {
    e.preventDefault();
    if ($('#clientForm').parsley().validate() == true) {
      var clientName =   $('#txtClient').val().trim();
      var condition = {"clientName":{ $regex: new RegExp('^' + clientName + '$', "i") }};
      if ($('#hdnClientId').val() != '')
      {
        condition['_id'] = {
          $ne:$('#hdnClientId').val()
        }
      }
      var existClient = clientMaster.find(condition).count()>0
      if (existClient === true) {
        FlashMessages.sendError('Client already exist.')
        return;
      }
      else {
        if ($('#hdnClientId').val() != '') {
          var objClient = {
            id: $('#hdnClientId').val(),
            name: $('#txtClient').val(),
            status: $("#" + $('#hdnClientId').val()).bootstrapSwitch('state')
          }
          Meteor.call('clientUpdate', objClient, function (err ,res) {
            if (err) {
              FlashMessages.sendError(err.message);
            }
            else {
              getClientData();
              $('#txtClient').val('');
              $('#hdnClientId').val('');
              FlashMessages.sendSuccess(messages.clientUpdate);
            }
          })
        }
        else {
          Meteor.call('clientInsert', $('#txtClient').val(), function (err ,res) {
            if (err) {
              FlashMessages.sendError(err.message);
            }
            else {
              getClientData();
              $('#txtClient').val('');
              FlashMessages.sendSuccess(messages.clientInsert)
            }
          })
        }
      }
    }
  },

  'click #lnkAddProject': function (e) {
    e.preventDefault();
    e.stopPropagation();
    var clientId = $(e.target).attr('data');
    FlowRouter.go('/project/' + clientId + '/add');
  },

  'click #lnkEditClient': function (e) {
    e.preventDefault();
    $('#hdnClientId').val($(e.target).closest('td').attr('id'));
    $('#txtClient').val($(e.target).attr('data'));
  },

  'click #lnkEditProject': function (e) {
    e.preventDefault();
    if (Meteor.user().roles.defaultgroup[0].toLowerCase() != constant.employee.toLowerCase()) {
      var projectId = $(e.target).closest('td').attr('id');
      var clientId = $(e.target).attr('data');
      FlowRouter.go('/project/' + clientId + '/' + projectId);
    }
  },

  'switchChange.bootstrapSwitch .client-status': function (e) {
    e.preventDefault();
    e.stopPropagation();
    var objClient = {
      id: this.id,
      name: this.name,
      status: this.status ? false : true
    }
    Meteor.call('clientUpdate', objClient, function (err, res) {
      if (err) {
        FlashMessages.sendError(err.message);
      }
      else {
        FlashMessages.sendSuccess(messages.clientUpdate);
      }
    })
  },

  'switchChange.bootstrapSwitch .project-status': function (e) {
    e.preventDefault();
    e.stopPropagation();
    var objProject = {
      id: e.target.id,
      status: e.target.checked
      //  ? false : true
    }
    Meteor.call('projectStatusUpdate', objProject, function (err, res) {
      if (err) {
        FlashMessages.sendError(err.message);
      }
      else {
        FlashMessages.sendSuccess(messages.clientUpdate);
      }
    })
  }
})

function getClientData() {
  setTimeout(function () {
    $('#tblClient').footable();
    if (Meteor.user().roles.defaultgroup[0].toLowerCase() == constant.admin.toLowerCase()
    || Meteor.user().roles.defaultgroup[0].toLowerCase() == constant.manager.toLowerCase()) {
      $("[name='client-checkbox']").bootstrapSwitch({
        onText: 'A',
        offText: 'I'
      })
    }
    else {
      $("[name='client-checkbox']").bootstrapSwitch({
        onText: 'A',
        offText: 'I',
        disabled: true
      });

      $('[id=lnkAddProject]').attr('disabled', true);
      $('[id=lnkAddProject]').prop('disabled', true);
      $('[id=lnkEditClient]').attr('disabled', true);
      $('[id=lnkEditClient]').prop('disabled', true);
      $('#btnAddClient').attr('disabled', true);
      $('#btnAddClient').prop('disabled', true);
      $('[id=lnkEditProject]').attr('disabled', true);
      $('[id=lnkEditProject]').prop('disabled', true);
    }
  }, 300)
  Meteor.call('getClientData', function (err, res) {
    if (err) {
      FlashMessages.sendError(err.message);
    }
    else {
      _clientData.set(res);
    }
  })
}
