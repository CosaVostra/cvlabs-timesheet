constant = {
  admin: 'admin',
  manager: 'manager',
  employee: 'employee'
}

rolearray= [
  { value:1, name: "Admin"},
  { value:2, name: "Manager"},
  { value:3, name: "Employee"},
];

messages = {
  clientInsert: 'Client inserted successfully.',
  clientUpdate: 'Client updated successfully.',
  projectInsert: 'Project inserted successfully.',
  projectUpdate: 'Project updated successfully.',
  levelInsert: 'Level inserted successfully.',
  levelUpdate: 'Level updated successfully.',
  expertisesInsert: 'Expertises inserted successfully.',
  expertisesUpdate: 'Expertises updated successfully.',
  timesheetInsert: 'Timesheet inserted successfully.',
  timesheetUpdate: 'Timesheet updated successfully.'
}

invitationTemplate = {
  subject: 'Invitation',
  text: 'You have been invited to join {{companyName}} team. \
  <a href="http://localhost:3000/{{companyId}}/{{userId}}/invite">invitation</a>'
}
