Meteor.methods({
  clientInsert: function (name) {
    clientMaster.insert({
      clientName: name
    })
  },

  clientUpdate: function (values) {
    clientMaster.update(values.id, {$set: {
      clientName: values.name,
      status: values.status
    }})
  },

  'getClientData': function () {
    var data = [];
    clientMaster.find().fetch().map(function (x) {
      var projects = [];
      projectMaster.find({clientId: x._id}).fetch().map(function (y) {
        projects.push({
          projectId: y._id,
          projectName: y.projectName,
          projectStatus: y.status
        })
      })
      data.push({
        id: x._id,
        name: x.clientName,
        status: x.status,
        projects: projects,
        projectCount: projects.length
      })
    });

    return data;
  },

  projectInsert: function (values) {
    projectMaster.insert({
      clientId: values.clientId,
      // clientName: values.clientName,
      projectName: values.projectName,
      maintenance: values.maintenance,
      budgetLines: values.budgetLines,
      creditLines: values.creditLines
    })
  },

  projectUpdate: function (projectId, values) {
    projectMaster.update(projectId, {$set: {
      clientId: values.clientId,
      // clientName: values.clientName,
      projectName: values.projectName,
      maintenance: values.maintenance,
      budgetLines: values.budgetLines,
      creditLines: values.creditLines
    }})
  },

  projectStatusUpdate: function (values) {
    projectMaster.update(values.id, {$set: {
      status: values.status
    }})
  },
})
