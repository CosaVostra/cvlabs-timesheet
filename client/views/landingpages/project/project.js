Template.project.onCreated(function () {
  _budgetLines = new ReactiveVar([]);
  _creditLines = new ReactiveVar([]);
  _isCredit = new ReactiveVar(false);
  _addBlock = new ReactiveVar(false);
})

Template.projectTable.rendered = function () {
  setProjectSwitch();
}

Template.project.rendered = function () {
  $('#projectForm').parsley();
  if (FlowRouter.getParam('_projectId') != 'add') {
    $('#btnAddProject').text('Update')
  }
}

Template.project.helpers({
  'getprojectData': function () {
    var data = projectMaster.findOne();
    if (data) {
      _budgetLines.set(data.budgetLines);
      _creditLines.set(data.creditLines);
      _isCredit.set(data.maintenance);
      return data.projectName;
    }
  },

  'clientName': function () {
    return clientMaster.findOne().clientName;
  },

  'isCredit': function () {
    return _isCredit.get();
  },

  'levels': function () {
    return levelMaster.find({status: true}).fetch();
  },

  'budgetLines': function () {
    return _budgetLines.get();
  },

  'checkedCredit': function () {
    return _isCredit.get() ? 'checked' : '';
  },

  'disableCredit': function () {
    return FlowRouter.getParam('_projectId') != 'add' ? 'disabled' : '';
  },

  'selectedLevel': function (key) {
    return key == this._id ? 'selected' : '';
  },

  'creditLines': function () {
    return _creditLines.get();
  },

  'formatDate': function (date) {
    return moment(date).format('D MMM, YY');
  },

  'addBlock': function () {
    return _addBlock.get();
  },

  'addOrUpdate': function () {
    return FlowRouter.getParam('_projectId') == 'add' ? true : false;
  },
})

Template.project.events({
  'change #chkCredit': function (e) {
    e.preventDefault();
    _isCredit.set(e.target.checked);
    _budgetLines.set([]);
    _creditLines.set([]);
    _addBlock.set(false);
  },

  'click #lnkAddLevels': function (e) {
    e.preventDefault();
    _addBlock.set(true);
    var level = $('#drpLevel').parsley().validate();
    var days = $('#txtDays').parsley().validate();
    addBudgetLines();
  },

  'click #lnkAddCredits': function (e) {
    e.preventDefault();
    _addBlock.set(true);
    var days = $('#txthours').parsley().validate();
    addCreditLines();
  },

  'submit #projectForm': function (e) {
    e.preventDefault();
    if ($('#txtProjectName').parsley().validate() == true) {
      var creditLines = _creditLines.get().length > 0 ? _creditLines.get() : [];
      if (_isCredit.get()) {
        if (creditLines.length == 0) {
          $('#txthours').parsley().validate();
          if($('#txthours').parsley().isValid() != true) {
            return;
          }
        }
        addCreditLines()
      }
      else {
        var level = $('#drpLevel').parsley().validate();
        var days = $('#txtDays').parsley().validate();
        if (level != true && days != true) {
          return;
        }
        addBudgetLines();
      }

      var objProject = {
        clientId: FlowRouter.getParam('_clientId'),
        clientName: $('#txtClientName').val(),
        projectName: $('#txtProjectName').val(),
        maintenance: $('#chkCredit').is(':checked'),
        budgetLines: _budgetLines.get(),
        creditLines: _creditLines.get()
      }

      Meteor.call('projectInsert', objProject, function (err ,res) {
        if (err) {
          FlashMessages.sendError(err.message);
        }
        else {
          FlashMessages.sendSuccess(messages.projectInsert);
          FlowRouter.go('/client');
        }
      })
    }
  },

  'click #btnUpdateProject': function (e) {
    e.preventDefault();
    if ($('#txtProjectName').parsley().validate() == true) {
      var projectId = FlowRouter.getParam('_projectId');
      var creditLines = _creditLines.get().length > 0 ? _creditLines.get() : [];
      if (_isCredit.get()) {
        addCreditLines()
      }
      else {
        addBudgetLines();
      }

      var objProject = {
        clientId: FlowRouter.getParam('_clientId'),
        clientName: $('#txtClientName').val(),
        projectName: $('#txtProjectName').val(),
        maintenance: $('#chkCredit').is(':checked'),
        budgetLines: _budgetLines.get(),
        creditLines: _creditLines.get()
      }

      Meteor.call('projectUpdate', projectId, objProject, function (err ,res) {
        if (err) {
          FlashMessages.sendError(err.message);
        }
        else {
          FlowRouter.go('/client');
          FlashMessages.sendSuccess(messages.projectUpdate);
        }
      })
    }
  },

  'blur .edit-budgetLines': function (e) {
    e.preventDefault();
    var budgetLines = _budgetLines.get();
    var lines = $('#linesEdit').children();
    for (var i = 0; i < lines.length; i++) {
      budgetLines[i].levelId = $(lines[i]).find('select').val();
      budgetLines[i].days = $(lines[i]).find('input').val();
    }
    _budgetLines.set(budgetLines);
  }
})

function setProjectSwitch() {
  setTimeout(function () {
    $("[name='project-checkbox']").bootstrapSwitch({
      onText: 'A',
      offText: 'I'
    });
  }, 300)
}

function addBudgetLines() {
  if ($('#drpLevel').parsley().isValid() == true &&
  $('#txtDays').parsley().validate() == true) {
    var arrBudgetLines = [];
    arrBudgetLines = _budgetLines.get();
    arrBudgetLines.push({
      _id: arrBudgetLines.length + 1,
      levelId: $('#drpLevel').val(),
      days: $('#txtDays').val()
    });
    _budgetLines.set(arrBudgetLines);
    $('#drpLevel').val('');
    $('#txtDays').val('');
  }
}

function addCreditLines() {
  if ($('#txthours').parsley().validate() == true) {
    var arrCreditLines = [];
    arrCreditLines = _creditLines.get();
    arrCreditLines.push({
      _id: arrCreditLines.length + 1,
      hours: $('#txthours').val()
    });
    _creditLines.set(arrCreditLines);
    $('#txthours').val('');
  }
}
