Template.dashboard.onCreated(function () {
  _project = new ReactiveVar([]);
  _level = new ReactiveVar([]);
  _expert = new ReactiveVar([]);
  _user = new ReactiveVar([]);
  _timesheet = new ReactiveVar([]);
  _details = new ReactiveVar(false);
  _projectName = new ReactiveVar('');
});

Template.dashboard.rendered = function () {
  Meteor.call('projectData', function (err, res) {
    if (err) {
      FlashMessages.sendError(err.message);
    }
    else {
      _project.set(res);
    }
  })
}

Template.projectTable.rendered = function () {
  $('#tblProjectStatistics').footable();
}

Template.levelStatistics.rendered = function () {
  $('#tblLevelStatistics').footable();
}

Template.expertisesStatistics.rendered = function () {
  $('#tblExpertStatistics').footable();
}

Template.userStatistics.rendered = function () {
  $('#tblUserStatistics').footable();
}

Template.timesheetStatistics.rendered = function () {
  $('#tblTimesheetStatistics').footable();
}

Template.dashboard.events({
  'click #btnExport': function(e) {
    e.preventDefault();
    var data = _project.get();
    data.map(function (x) {
      delete x.projectId
    })
    fileContent = json2csv(JSON.stringify(data), true, true)
    var nameFile = 'projectData.csv';
    if(fileContent){
      var blob = new Blob([fileContent], {type: "text/plain;charset=utf-8"});
      saveAs(blob, nameFile);
    }
  },

  'click .project-link': function (e) {
    e.preventDefault();
    _projectName.set(this.project);
    Meteor.call('projectStatistics', e.target.id, function (err, res) {
      if (err) {
        FlashMessages.sendError(err.message);
      }
      else {
        _details.set(true);
        _level.set(res.level);
        _expert.set(res.expert);
        _user.set(res.user);
        _timesheet.set(res.timesheet);
        setTimeout(function () {
          $('#timesheetModal').modal('show');
        }, 10);
      }
    })
  }
})

Template.dashboard.helpers({
  showDetails : function () {
    return _details.get();
  },
  user: function () {
    if (Meteor.user().roles.defaultgroup[0] == 'Employee') {
      return false;
    }
    else {
      return true;
    }
  },

  projectName: function () {
    return _projectName.get();
  }
});

Template.projectTable.helpers({
  projectdata : function () {
    return _project.get();
  }
});

Template.levelStatistics.helpers({
  leveldata : function () {
    return _level.get();
  }
});

Template.expertisesStatistics.helpers({
  expertsdata : function () {
    return _expert.get();
  }
});

Template.userStatistics.helpers({
  userdata : function () {
    return _user.get();
  }
});

Template.timesheetStatistics.helpers({
  timesheetdata : function () {
    return _timesheet.get();
  }
});
