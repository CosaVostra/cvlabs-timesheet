Template.registerHelper('isReady', function (sub) {
  if(sub) {
    return FlowRouter.subsReady(sub);
  } else {
    return FlowRouter.subsReady();
  }
})

Template.registerHelper('showSpinner', function (sub) {
  return Session.get("spinner");
})

Template.registerHelper('numberFormat', function (days) {
  return numeral(days).format('0.0');
})
