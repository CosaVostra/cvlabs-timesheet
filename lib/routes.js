FlowRouter.triggers.enter(
  [trackRouteEntry],
  {except: ['login', 'register', 'invite', 'reset-password']}
);

FlowRouter.route('/login', {
  name: 'login',
  action: function(params) {
    BlazeLayout.render('login');
  }
});

FlowRouter.route('/register', {
  name: 'register',
  action: function(params) {
    BlazeLayout.render('register');
  }
});

FlowRouter.route('/:_companyId/:_userId/invite', {
  name: 'invite',
  action: function(params) {
    BlazeLayout.render('invite');
  },
  subscriptions: function (params, queryParams) {
    this.register('inviteeData', Meteor.subscribe('invite', params))
  }
});

FlowRouter.route('/#/reset-password/:_token', {
  name: 'reset-password',
});

FlowRouter.route('/', {
  name: 'dashboard',
  action: function(params) {
    BlazeLayout.render('adminLayout', {content: 'dashboard'});
  },
  subscriptions: function (params, queryParams) {
    this.register('currentUser',Meteor.subscribe('currentUser'))
  }
});

FlowRouter.route('/levels', {
  name: 'levels',
  triggersEnter: [trackEmployeeEntry],
  action: function(params) {
    BlazeLayout.render('adminLayout', {content: 'levels'});
  },
  subscriptions: function (params, queryParams) {
    this.register('currentUser', Meteor.subscribe('currentUser'))
  }
});

FlowRouter.route('/timesheet/:_timesheetId', {
  name: 'timesheet',
  action: function(params) {
    BlazeLayout.render('adminLayout', {content: 'timesheet'});
  },
  subscriptions: function (params, queryParams) {
    this.register('currentUser', Meteor.subscribe('currentUser')),
    this.register('projectData', Meteor.subscribe('timesheet'))
  }
});

FlowRouter.route('/expertises', {
  name: 'expertises',
    triggersEnter: [trackEmployeeEntry],
  action: function(params) {
    BlazeLayout.render('adminLayout', {content: 'expertises'});
  },
  subscriptions: function (params, queryParams) {
    this.register('currentUser', Meteor.subscribe('currentUser'))
  }
});

FlowRouter.route('/:_companyId/user/:_userId', {
  name: 'userManagement',
  action: function(params) {
    BlazeLayout.render('adminLayout', {content: 'userManagement'});
  },
  subscriptions: function (params, queryParams) {
    this.register('currentUser', Meteor.subscribe('currentUser')),
    this.register('userdata', Meteor.subscribe('user', params))
  }
});

FlowRouter.route('/:_companyId/user', {
  name: 'usercontent',
  action: function(params) {
    BlazeLayout.render('adminLayout', {content: 'usercontent'});
  },
  subscriptions: function (params, queryParams) {
    this.register('currentUser', Meteor.subscribe('currentUser')),
    this.register('userdata', Meteor.subscribe('user', params))
  }
});

FlowRouter.route('/client', {
  name: 'client',
    triggersEnter: [trackEmployeeEntry],
  action: function(params) {
    BlazeLayout.render('adminLayout', {content: 'client'});
  },
  subscriptions: function (params, queryParams) {
    this.register('currentUser', Meteor.subscribe('currentUser')),
    this.register('clientData', Meteor.subscribe('client'))
  }
});

FlowRouter.route('/project/:_clientId/:_projectId', {
  name: 'project',
  action: function(params) {
    BlazeLayout.render('adminLayout', {content: 'project'});
  },
  subscriptions: function (params, queryParams) {
    this.register('currentUser',Meteor.subscribe('currentUser')),
    this.register('projectData', Meteor.subscribe('project', params))
  }
});

FlowRouter.notFound = {
  action: function() {
    BlazeLayout.render('notFound');
  }
};

function trackRouteEntry() {
  if (!Meteor.userId()) {
    FlowRouter.go('/login')
  }
}

function trackEmployeeEntry() {
  if (Meteor.user() && Meteor.user().roles.defaultgroup[0] == "Employee") {
    FlowRouter.go('/')
  }
}
