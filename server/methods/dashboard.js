Meteor.methods({
  projectData: function () {
    var projectData = [];
    projectMaster.find().fetch().map(function (x) {
      var spentDays = 0;
      var budgetedDays = 0;
      var unit = 'days';

      if (x.budgetLines.length > 0) {
        for (var i = 0; i < x.budgetLines.length; i++) {
          budgetedDays = budgetedDays + x.budgetLines[i].days;
        }
      }
      else {
        // unit = 'credits';
        for (var i = 0; i < x.creditLines.length; i++) {
          budgetedDays = budgetedDays + convertHourstoDays(x.creditLines[i].hours, 00)
        }
      }

      timesheetMaster.find({projectId: x._id}).fetch().map(function (x) {
        spentDays = spentDays + convertHourstoDays(x.hour, x.minute);
      })

      var ratio = (spentDays * 100) / budgetedDays;

      projectData.push({
        projectId: x._id,
        client: clientMaster.findOne({_id: x.clientId}).clientName,
        project: x.projectName,
        spentTime: numeral(spentDays).format('0.0') + ' ' + unit,
        budgetedDays: numeral(budgetedDays).format('0.0') + ' ' + unit,
        ratio: numeral(ratio).format('0') + '%',
        type: x.maintenance ? 'Credits' : 'Days',
        status: x.status ? 'Active' : 'Inactive'
      })
    })

    return projectData;
  },

  projectStatistics: function (projectId) {
    var tsData = timesheetMaster.find({projectId: projectId}).fetch();
    var projectData = projectMaster.findOne({_id: projectId});
    var budgetLines = projectData.budgetLines;
    var creditLines = projectData.creditLines;

    var users = _.uniq(tsData, false, function (x) {
      return x.userId;
    })
    users = users.map(function(a) {return a.userId;});
    users = Meteor.users.find({_id: {$in: users}}).fetch();

    // var userLevels = _.uniq(users, false, function (x) {
    //   return x.profile.levelId;
    // })
    // levels = userLevels.map(function(a) {return a.profile.levelId;});
    // userLevels = Meteor.users.find({'profile.levelId': {$in: levels}}).fetch();
    // levels = levelMaster.find({_id: {$in: levels}}).fetch();

    levels = budgetLines.map(function (a) { return a.levelId });
    levels = levelMaster.find({_id: {$in: levels}}).fetch();

    var experts = _.uniq(tsData, false, function (x) {
      return x.expertisesId;
    });
    experts = experts.map(function(a) {return a.expertisesId;});
    experts = expertisesMaster.find({_id: {$in: experts}}).fetch();

    // expert Stats;
    var expertData = [];
    for (var i = 0; i < experts.length; i++) {
      var days = 0;
      for (var j = 0; j < tsData.length; j++) {
        if (tsData[j].expertisesId == experts[i]._id) {
          days = days + convertHourstoDays(tsData[j].hour, tsData[j].minute)
        }
      }
      expertData.push({
        expertName: experts[i].expertisesName,
        days: numeral(days).format('0.0')
      })
    }
    expertData = expertData.sort(function (a, b) {
      return a.expertName > b.expertName;
    })

    // users/team members stats
    var userData = [];
    for (var i = 0; i < users.length; i++) {
      var days = 0;
      for (var j = 0; j < tsData.length; j++) {
        if (tsData[j].userId == users[i]._id) {
          days = days + convertHourstoDays(tsData[j].hour, tsData[j].minute)
        }
      }
      userData.push({
        userId: users[i]._id,
        levelId: users[i].profile.levelId,
        userName: users[i].profile.firstName + ' ' + users[i].profile.lastName,
        days: days
      })
    }
    userData = userData.sort(function (a, b) {
      return a.userName > b.userName;
    })

    // level - user data stats
    var levelData = {};
    var arrLevelData = [];
    var totalBudget = 0;
    var totalSpent = 0;
    for (var i = 0; i < levels.length; i++) {
      var budgetDays = 0;
      var spentDays = 0;
      var user = userData.map(function(a) {
        if (a.levelId == levels[i]._id) {
          spentDays = Number(spentDays) + Number(a.days)
          return a.userId;
        }
      });

      if (budgetLines.length > 0) {
        budgetLines.map(function (x) {
          if (x.levelId == levels[i]._id) {
            budgetDays = Number(budgetDays) + Number(x.days)
          }
        })
        totalBudget = Number(totalBudget) + Number(budgetDays);
      }
      else {
        creditLines.map(function (x) {
          budgetDays = budgetDays + convertHourstoDays(x.hours, 0);
        })
        totalBudget = Number(totalBudget) + Number(budgetDays);
      }
      spentDays = spentDays > 0 ? numeral(spentDays).format('0.0') : spentDays;
      totalSpent = Number(totalSpent) + Number(spentDays);
      totalSpent = totalSpent > 0 ? numeral(totalSpent).format('0.0') : totalSpent;

      arrLevelData.push({
        level: levels[i].levelName,
        budgetDays: numeral(budgetDays).format('0.0'),
        spentDays: spentDays,
        diff: Number(budgetDays) - Number(spentDays),
      })
    }
    arrLevelData = arrLevelData.sort(function (a, b) {
      return a.level > b.level;
    })

    levelData = {
      levels: arrLevelData,
      totalBudget: numeral(totalBudget).format('0.0'),
      totalSpent: totalSpent,
      totalDiff: Number(totalBudget) - Number(totalSpent)
    }

    // timesheet stats
    var timesheetData = [];
    for (var i = 0; i < tsData.length; i++) {
      user = users.filter(function (x) {
        return x._id == tsData[i].userId;
      })
      user = user[0].profile.firstName + user[0].profile.lastName;
      minute = tsData[i].minute == 30 ? tsData[i].minute + 'm' : '';
      timesheetData.push({
        date: moment(tsData[i].date).format('L'),
        member: user,
        time: tsData[i].hour + 'h ' + minute,
        task: tsData[i].tasks,
        createDate: tsData[i].createDate
      })
    }
    timesheetData = timesheetData.sort(function (a, b) {
      return a.createDate < b.createDate
    })

    // return levelData;
    return {
      level: levelData,
      expert: expertData,
      user: userData,
      timesheet: timesheetData
    };
  },
})

function convertHourstoDays(hrs, mins) {
  if (mins == 30) {
    hrs = hrs + 0.5;
  }
  days = hrs / 7.5;
  return days;
}
