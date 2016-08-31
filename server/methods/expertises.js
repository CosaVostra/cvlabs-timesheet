Meteor.methods({
  expertisesInsert: function (name) {
    expertisesMaster.insert({
      expertisesName: name
    }, function (err ,res) {
      if (err) {
        console.log(err.message);
      }
    })
  },

  expertisesUpdate: function (values) {
    expertisesMaster.update(values.id, {$set: {
      expertisesName: values.name,
      status: values.status
    }}, function (err ,res) {
      if (err) {
        console.log(err.message);
      }
    })
  },

  getExpertises: function () {
    return expertisesMaster.find().fetch();
  }
})
