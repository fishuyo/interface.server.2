TransportManager
================
The TransportManager loads and manages abstractions for the various protocols that IS2 speaks, such
as OSC, MIDI and WebSockets.

**lo-dash** is our utility library of choice

    var _ = require( 'lodash' )
		
    TM = module.exports = {
      app: null,

*defaults* is an array of transports that are loaded by default.

      defaults: [ 'OSC' ],

The *loaded* array stores all transports that have been loaded by the IOManager			

      loaded: {},

Upon loading a transport, the *verify* method is called on the object to ensure that it is valid.
Transports must have methods for initialization, opening / closing, and sending / receiving.

      verify: function( transport, transportName ) {
        var result = false
        
        if( typeof transport === 'object' ) {
          if( ( transport.init ) ) {
            result = true
          }else{
            console.error( 'Transport ' + transportName + ' is not a valid transport module.' )
          }
        }
        
        return result
      },
      
The *load* method attempts to find a given IO module and require it. If the module is found and verified, the modules *init* method is then called.

      load: function( transportName ) {
        var transport
        
        if( _.has( TM.loaded, transportName ) ) {
          console.log( 'Transport ' + transportName + ' is already loaded.' )
          return
        }
        
        //console.log( TM.app.root + 'transports/' + transportName + '.js ')
        
        try {
          transport = require( TM.app.root + 'transports/' + transportName + '.js' )
        }catch( e ) {
          console.log( 'Transport ' + transportName + ' not found.' )
          return
        }finally{
          console.log( 'Transport ' + transportName + ' is loaded.' )
        }
        
        if( TM.verify( transport, transportName ) ) {
          transport.init( TM.app )
          TM.loaded[ transportName ] = transport
        }
      },
      
The *init* function loads every io stored named in the *defaults* array. TODO: there should be some type of user preferences that decide which modules are loaded.

      init: function( app ) {
        this.app = app
        
        _.forEach( this.defaults, this.load )
        
        return this
      },
    }