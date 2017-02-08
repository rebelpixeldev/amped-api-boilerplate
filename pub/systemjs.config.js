/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
  System.config({
    paths: {
      // paths serve as alias
      'npm:': '../node_modules/'
    },
    // map tells the System loader where to look for things
    map: {
      // our app is within the app folder
      app: '',

      // angular bundles
      '@angular/core'             : 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common'           : 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler'         : 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser' : 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic'
                                  : 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/http'             : 'npm:@angular/http/bundles/http.umd.js',
      '@angular/router'           : 'npm:@angular/router/bundles/router.umd.js',
      '@angular/forms'            : 'npm:@angular/forms/bundles/forms.umd.js',
      '@angular/upgrade'          : 'npm:@angular/upgrade/bundles/upgrade.umd.js',

      // other libraries
      'chart.js'                  : 'npm:chart.js/dist/chart.js',
      'ng2-charts'                : 'npm:ng2-charts',
      'ng2-pagination'            : 'npm:ng2-pagination/dist',
      'moment'                    : 'npm:moment',
      'angular2-moment'           : 'npm:angular2-moment',
      'socket.io-client'          : 'npm:socket.io-client/dist/socket.io.js',
      'rxjs'                      : 'npm:rxjs',
      '@angular/material'         : 'npm:@angular/material/bundles/material.umd.js',
      'angular-in-memory-web-api' : 'npm:angular-in-memory-web-api/bundles/in-memory-web-api.umd.js'
    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      app               : { defaultExtension: 'js', main: './src/scripts/main.js'},
      rxjs              : { defaultExtension: 'js' },
      'socket.io-client': { defaultExtension: 'js' },
      'chart.js'        : { defaultExtension: 'js' },
      'ng2-sharts'      : { defaultExtension: 'js', main: 'ng2-charts.js' },
      'ng2-pagination'  : { defaultExtension: 'js', main: 'ng2-pagination.js' },
      'moment'          : { defaultExtension: 'js', main: 'moment.js' },
      'angular2-moment' : { defaultExtension: 'js', main: 'index.js' }
    },
    meta: {
      moment: {
        format: 'global',
        globals: {
          moment: 'moment'
        }
      }
    }
  });
})(this);
