Meteor.publish("currentUser", function(userId) {
  return [
    Meteor.users.find({_id: this.userId}),
    Meteor.roles.find({})
  ];
});

Meteor.publish("timesheet", function() {
  return [
    projectMaster.find({}),
    clientMaster.find({}),
    expertisesMaster.find({})
  ]
});

Meteor.publish("project", function(params) {
  return [
    projectMaster.find({_id: params._projectId}),
    clientMaster.find({_id: params._clientId}),
    levelMaster.find({})
  ]
});

Meteor.publish("invite", function(params) {
  return [
    Meteor.users.find({_id: params._userId}),
    companyMaster.find({_id: params._companyId})
  ]
});

Meteor.publish("user", function(params) {
  return [
    Meteor.users.find({_id: params._userId}),
    companyMaster.find({_id: params._companyId}),
    levelMaster.find({})
  ]
});

Meteor.publish("client", function() {
  return [
    clientMaster.find({})
  ]
});
