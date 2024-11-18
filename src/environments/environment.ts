// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  googleMapsApiKey: 'AIzaSyAf_OvX6xeBDHcw1Km_CfqmNk9jSR9baMs',
  // serverBaseUrl: 'http://localhost:3000/api/',
  // serverUrl: 'http://localhost:3000/',
  razorpay: {
    key_id: 'your_key_id',
    key_secret: 'your_secret'
  },
   // serverBaseUrl: 'http://your_ip_address:3000/api/',
   // serverUrl: 'http://your_ip_address:3000/',
  serverBaseUrl: 'https://echnelapp-store.onrender.com/api/',
  serverUrl: 'https://echnelapp-store.onrender.com/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
