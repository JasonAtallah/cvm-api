
module.exports = {

  prepApproveVendorEmail(req, res, next) {
    var message = '';
    message += `To: ${req.vendor.contact.email} \r\n`;
    message += `Subject: ${req.state.data.email.subject} \r\n`;
    message += `\n${req.state.data.email.body}\n\nPlease visit ${req.state.data.scheduleUrl} to schedule a time to meet with the buyer.`;

    req.email = {
      message: message
    };
    next();
  },

  prepBuyerCancelsApptEmail(req, res, next) {
    var message = '';
    message += `To: ${req.vendor.contact.email} \r\n`;
    message += `Subject: ${req.buyer.profile.company.name} cancelled your appointment \r\n`;
    message += `${req.buyer.profile.company.name} cancelled your appointment on ${req.prevState.selectedTime.startDate} ${req.prevState.selectedTime.startTime}.`;

    req.email = {
      message: message
    };
    next();
  },

  prepBuyerSendsTimesEmail(req, res, next) {
    var message = '';
    message += `To: ${req.vendor.contact.email} \r\n`;
    message += `Subject: ${req.buyer.profile.company.name} has sent you times to meet \r\n`;
    message += `${req.buyer.profile.company.name} has proposed times to meet. Visit ${req.state.data.vendorUrl} to select a time that works for you.`;

    req.email = {
      message: message
    };
    next();
  },

  prepRejectVendorEmail(req, res, next) {
    var message = '';
    message += `To: ${req.vendor.contact.email} \r\n`;
    message += `Subject: ${req.state.data.email.subject} \r\n`;
    message += `\r\n ${req.state.data.email.body}`;

    req.email = {
      message: message
    };
    next();
  },

  prepVendorCancelsApptEmail(req, res, next) {
    var message = '';
    message += `To: ${req.buyer.gProfile.email} \r\n`;
    message += `Subject: Vendor cancelled their appointment \r\n`;
    message += `${req.vendor.company.name} cancelled their appointment on ${req.prevState.selectedTime.startDate} ${req.prevState.selectedTime.startTime}. It has been removed from your calendar.`;

    req.email = {
      message: message
    };
    next();
  },

  prepVendorChoosesTimeEmail(req, res, next) {
    var message = '';
    message += `To: ${req.buyer.gProfile.email} \r\n`;
    message += `Subject: Vendor chose a time \r\n`;
    message += `${req.vendor.company.name} selected ${req.state.data.selectedTime.startDate} ${req.state.data.selectedTime.startTime} at ${req.state.data.selectedTime.location} for ${req.state.data.selectedTime.name}. It has been added to your calendar.`;

    req.email = {
      message: message
    };
    next();
  },

  prepVendorRejectsAllTimesEmail(req, res, next) {
    var message = '';
    message += `To: ${req.buyer.gProfile.email} \r\n`;
    message += `Subject: Vendor requested new times \r\n`;
    message += `${req.vendor.company.name} indicated that none of the times you proposed worked for them.`;

    req.email = {
      message: message
    };
    next();
  }

};
