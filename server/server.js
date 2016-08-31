import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  process.env.MAIL_URL = 'smtp://postmaster@sandboxc32a84abd8ad4c4a8c03625922548fa9.mailgun.org:6360bffce4adc38b2f13c65513de3bac@smtp.mailgun.org:587';
  Accounts.emailTemplates.siteName = "timesheet.com";
  Accounts.emailTemplates.from = "timesheet.com <support@timesheet.com>";
});
