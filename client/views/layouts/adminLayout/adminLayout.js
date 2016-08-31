Template.header.helpers({
  'username': function () {
    return Meteor.user().profile ? Meteor.user().profile.firstName : Meteor.user().emails[0].address
  }
})

Template.sideBar.helpers({
  'showLink': function () {
    if (Meteor.user().roles.defaultgroup[0].toLowerCase() == constant.employee.toLowerCase()) {
      return false;
    }
    else {
      return true;
    }
  }
})

Template.sideBar.events({
  'click .sidebar-menu li': function(e){
    $('.sidebar-menu li').removeClass('active')
    $(e.target).closest( "li" ).addClass('active')
  }
})

Template.adminLayout.events({
  'click #lnkLogout': function (e) {
    e.preventDefault();
    Meteor.logout(function(){
      FlowRouter.go('/login');
    });
  }
})

Template.sideBar.events({
  'click #lnkuser': function (e) {
    e.preventDefault();
    e.stopPropagation();
    $('.sidebar-menu li').removeClass('active')
    $(e.target).closest( "li" ).addClass('active')
    var companyId = Meteor.user().companyId;
    FlowRouter.go( '/' + companyId + '/user');
  }
})
