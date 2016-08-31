Meteor.methods({
  levelInsert: function (name) {
    levelMaster.insert({
      levelName: name
    }, function (err ,res) {
      if (err) {
        console.log(err.message);
      }
    })
  },

  levelUpdate: function (values) {
    levelMaster.update(values.id, {$set: {
      levelName: values.name,
      status: values.status
    }}, function (err ,res) {
      if (err) {
        console.log(err.message);
      }
    })
  },

  getLevels: function () {
    return levelMaster.find().fetch();
  }
})
