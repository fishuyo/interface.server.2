main.js
=======

    var _

    IS2 = {
      ioManager: null,
      packages: {
        lodash : null
      },
      root: __dirname + '/src/',
      src: __dirname + '/src/',
      init: function() {
        _ = this.packages.lodash = require( 'lodash' )
        
        this.ioManager = require( './io/IOManager.js' ).init( this )
      }
    }
    
    IS2.init()