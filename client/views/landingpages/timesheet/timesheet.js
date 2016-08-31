var arrData = [];
Template.timesheet.rendered = function () {
  document.title = 'Timesheet';
  $('#txtDate').datepicker({
    autoclose: true,
    defaultDate: new Date(),
    clearBtn: true,
    todayBtn: true,
    todayHighlight: true,
    keyboardNavigation: true,
    format: 'mm/dd/yyyy'
  })
  $('#txtDate').datepicker('setDate', new Date());
  $('#txtDate').val(moment(new Date()).format('L'));
  $("#timesheetForm").parsley();
  Meteor.typeahead.inject();
}

Template.timesheet.onCreated(function(){
  _projectId = new ReactiveVar('');
  expertisedata = new ReactiveVar();
  _clientId = new ReactiveVar('');
});

Template.timesheet.helpers({
  'clientProjectData': function () {
    clientMaster.find({status: true}).fetch().map(function (y) {
      projectMaster.find({status: true,clientId: y._id}).fetch().map(function(x){
        arrData.push({
          projectId: x._id,
          clientId: y._id,
          value: y.clientName + ' - ' + x.projectName
        });
      })
    });
    return arrData
  },
  expertisedata: function() {
    var _arr =  expertisesMaster.find({}).fetch();
    Meteor.setTimeout(function(){
      $(".chosen").chosen();
    },500)
    return _arr;
  },
  'selectedClientProject': function (e, suggestion) {
    _projectId.set(suggestion.projectId);
    _clientId.set(suggestion.clientId);
  },

  'selectedExpertise': function (e, suggestion) {
    _expertisesId.set(suggestion.id);
  }
});

Template.timesheet.events({
  'submit #timesheetForm': function (e) {
    e.preventDefault();
    if ($("#timesheetForm").parsley().validate() == true) {
      var obj = {
        clientId: _clientId.get(),
        projectId: _projectId.get(),
        expertisesId:$("#selExpertise").val(),
        date:$("#txtDate").val(),
        hour:$("#txthour").val(),
        minute:$("#txtminute").val(),
        tasks:$("#txttask").val()
      }

      Meteor.call('timesheetInsert',obj, function (err ,res) {
        if (err) {
          FlashMessages.sendError(err.message);
        }
        else {
          var _txtProject = $('#txtProject').val();
          var _isFound = false;
          for (var i = 0; i < arrData.length; i++) {
            if (_txtProject == arrData[i].value) {
              _isFound = true;
              break;
            }
          }
          if (!_isFound) {
            FlashMessages.sendError("Please select correct project");
          }
          else if (!(expertisesMaster.find({_id: $('#selExpertise').val()}).count()>0)) {
            FlashMessages.sendError("Please select correct expertise");
          }
          else {
            $('#timesheetForm').trigger('reset');
            setTimeout(function () {
              FlashMessages.sendSuccess(messages.timesheetInsert);
              $('.typeahead').typeahead('val', '');
              $('#txtDate').datepicker('setDate', new Date());
              $('#txtDate').val(moment(new Date()).format('L'));
            }, 100);
            _clientId.set('');
            _projectId.set('');
          }
        }
      })
    }
  }
})
