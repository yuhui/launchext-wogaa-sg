module.exports = {
  "extensions": {
    "wogaa-sg": {
      "displayName": "WOGAA",
      "settings": {}
    }
  },
  "dataElements": {},
  "rules": [{
    "id": "RL1703173180183",
    "name": "Page Top, order 50",
    "events": [{
      "modulePath": "sandbox/pageTop.js",
      "settings": {}
    }],
    "actions": [{
      "modulePath": "wogaa-sg/src/lib/actions/implementInformationalService.js",
      "settings": {}
    }]
  }, {
    "id": "RL1703173207639",
    "name": "Click, order 50",
    "events": [{
      "modulePath": "sandbox/click.js",
      "settings": {}
    }],
    "actions": [{
      "modulePath": "wogaa-sg/src/lib/actions/implementTransactionalService.js",
      "settings": {
        "type": "start",
        "trackingId": "foobar",
        "uniqueTransactionId": "none"
      }
    }]
  }, {
    "id": "RL1703173420434",
    "name": "Click, order 100",
    "events": [{
      "modulePath": "sandbox/click.js",
      "settings": {},
      "order": "100"
    }],
    "actions": [{
      "modulePath": "wogaa-sg/src/lib/actions/correlateSentimentsWithAgencysData.js",
      "settings": {
        "agencyTxnId": "txn_123"
      }
    }, {
      "modulePath": "wogaa-sg/src/lib/actions/implementTransactionalService.js",
      "settings": {
        "type": "complete",
        "trackingId": "foo-bar",
        "uniqueTransactionId": "hello_123"
      }
    }]
  }],
  "property": {
    "name": "Sandbox property",
    "settings": {
      "id": "PR12345",
      "domains": ["adobe.com", "example.com"],
      "undefinedVarsReturnEmpty": false
    }
  },
  "company": {
    "orgId": "ABCDEFGHIJKLMNOPQRSTUVWX@AdobeOrg"
  },
  "environment": {
    "id": "EN00000000000000000000000000000000",
    "stage": "development"
  },
  "buildInfo": {
    "turbineVersion": "27.5.0",
    "turbineBuildDate": "2023-12-21T16:02:37.223Z",
    "buildDate": "2023-12-21T16:02:37.223Z",
    "environment": "development"
  }
}