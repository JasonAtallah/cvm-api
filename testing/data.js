const _ = require('lodash');

const values = {

  VENDOR_ID: '5a5da934e85e6a1bc020f40f',
  QID: '5a1f7dcc8b9908d71f25e56d',

  vendor1: {
    company: {
      name: 'test 1',
      city: 'Redwood City'
    },
    contact: {
      firstName: 'Sammy',
      email: 'jason.atallah@gmail.com'
    }
  },

  vendor2: {
    company: {
      name: 'test 2',
      city: 'San Jose'
    },
    contact: {
      firstName: 'Johnny',
      email: 'jason.atallah@gmail.com'
    }
  },

  event: {
    name: 'New Meeting',
    location: '11 Main Street',
    date: '1/20/2018',
    time: '8:00',
    duration: 30
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

  suggestedTimes: [
    {
      location: {
        name: 'HQ',
        address: '111 main street',
        zip: '94401',
        city: 'San Mateo',
        state: 'CA'
      },
      duration: 30,
      startDate: '2018-01-15T05:30:30.393Z'
    },
    {
      location: {
        name: 'HQ',
        address: '222 main street',
        zip: '94401',
        city: 'San Mateo',
        state: 'CA'
      },
      duration: 30,
      startDate: '2018-01-16T05:30:30.393Z'
    }
  ],
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

  badSelectedTime: {
    location: {
      name: 'HQ',
      address: '860 prospect row',
      zip: '94401',
      city: 'San Mateo',
      state: 'CA'
    },
    startDate: '2018-01-11T15:15:12.637Z',
    duration: 30
  },

  newCalendar: {
    name: 'new cal 1',
    timezone: 'America/Los_Angeles'
  }
};

module.exports = Object.assign(values, {
  get(path, override) {
    let value = _.get(values, path);
    if (override && typeof value === 'object') {
      Object.keys(override).forEach((key) => {
        _.set(value, key, override[key]);
      });
    }
    return value;
  }
});