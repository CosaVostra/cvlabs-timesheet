Meteor.methods({
  checkCompany: function (companyName) {
    return companyMaster.find({companyName: { $regex: new RegExp("^" + companyName, "i") }}).fetch();
  },

  companyInsert: function (name) {
    companyMaster.insert({
      companyName: name
    }, function (err ,res) {
      if (err) {
        console.log(err.message);
      }
      else {
        Meteor.users.update(Meteor.userId(), {$set: {
          companyId: res
        }
      })
      var roles = ['Admin'];
      Roles.addUsersToRoles(Meteor.userId(), roles, 'defaultgroup');
    }
  })
},

'addRoles': function () {
  var roles = ['Admin'];
  Roles.addUsersToRoles(this.userId, roles, 'defaultgroup');
}
})
