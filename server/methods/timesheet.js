Meteor.methods({
  timesheetInsert: function (obj) {
    var hdntimesheetid;
    hdntimesheetid = timesheetMaster.insert({
      clientId: obj.clientId,
      projectId: obj.projectId,
      expertisesId: obj.expertisesId,
      userId: this.userId,
      date: obj.date,
      hour: obj.hour,
      minute: obj.minute,
      tasks: obj.tasks
    }, function (err ,res) {
      if (err) {
        console.log(err.message);
      }
      else{
        // console.log(timesheetMaster.find().fetch()); 
      }
    })
  },

  timesheetUpdate: function (timesheetidval,obj) {
    hdntimesheetid = timesheetMaster.update(timesheetidval, {$set: {
      clientId: obj.clientId,
      projectId: obj.projectId,
      expertisesId: obj.expertisesId,
      userId: this.userId,
      date: obj.date,
      hour: obj.hour,
      minute: obj.minute,
      tasks: obj.tasks
    }}, function (err ,res) {
      if (err) {
        console.log(err.message);
      }
    })
  }
})
