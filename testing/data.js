

module.exports = {
  VENDOR_ID: '5a5c39c078f76030cb9feb0f',
  QID: '5a1f7dcc8b9908d71f25e56d',

  vendor1: {
    company: {
      name: 'Vendor 1',
      city: 'Redwood City'
    },
    contact: {
      firstName: 'Sammy',
      email: 'arieljake@gmail.com'
    }
  },

  vendor2: {
    company: {
      name: 'Vendor 2',
      city: 'San Jose'
    },
    contact: {
      firstName: 'Johnny',
      email: 'arieljake@gmail.com'
    }
  },

  event: {
    name: 'New Meeting',
    location: '11 Main Street',
    date: '1/21/2018',
    time: '8:00',
    duration: '30'
  },

  location: {
    name: 'HQ',
    address: '111 Main Street',
    city: 'Santa Rosa',
    state: 'CA',
    zip: '94928'
  },

  approvalEmail: {
    subject: 'Congrats',
    body: 'Come meet us',
    scheduleUrl: `${this.BUYER_HOST}/?vid=${this.VENDOR_ID}`
  },
  rejectionEmail: {
    subject: 'Sorry',
    body: 'Not interested'
  },

  suggestedTimes: {
    location1: {
      address: '111 main street',
      city: 'San Mateo',
      state: 'CA',
      zip: '94401'
    },
    startDate1: 'Thu Jan 12 2018 07:30:12 GMT-0800 (PST)',
    duration1: 30,
    location2: {
      address: '22 main street',
      city: 'San Mateo',
      state: 'CA',
      zip: '94401'
    },
    startDate2: 'Thu Jan 11 2018 07:30:12 GMT-0800 (PST)',
    duration2: 30
  },
  vendorUrl: `${this.BUYER_HOST}/?vid=${this.VENDOR_ID}`,

  profile: {
    company: {
      name: 'Blunts and Brownies',
      city: 'Santa Rosa'
    },
    contact: {
      firstName: 'Jason',
      email: 'jason.atallah@gmail.com'
    }
  },

  questionnaireResponse: {
    company: {
      name: 'RP Weed',
      city: 'Rohnert Park'
    },
    contact: {
      firstName: 'Jason',
      email: 'jasonatallah@gmail.com'
    },
    flowers1: {
      name: 'Paris OG',
      weightAvailable: 30,
      thc: 20
    }
  },

  selectedTime: {
    location: {
        name: 'Jason Atallah',
        address: '860 prospect row',
        zip: '94401',
        city: 'San Mateo',
        state: 'CA'
    },
    duration: 30,
    startDate: '2018-01-11T15:15:12.637Z'
}
};