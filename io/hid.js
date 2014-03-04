var _, HID, EE,
_HID = module.exports = {
app: null,
devices: null,
loaded: [],
getDeviceNames: function() { return _.pluck( this.devices, 'product' ) },
init: function( app ) {
this.app = app

_ = this.app.packages.lodash

EE = require('events').EventEmitter

HID = require( this.app.root + 'io/node_modules/node-hid')

this.devices = HID.devices()

//console.log( this.getDeviceNames() )

var idx = _.findIndex( this.devices, { manufacturer:'Mega World'} )
var device = new HID.HID( this.devices[ idx ].path )

device.btnState = [0,0,0,0,0,0,0]

this.loaded.push( device )
device.on( 'data', this.read.bind( device ) )
},

read: function( data ) {
var xaxis = data[ 0 ],
yaxis = data[ 1 ],
btns = data[ 2 ]

if( xaxis !== this.xaxis ) {
this.emit( 'X', xaxis, this.xaxis )
this.xaxis = xaxis
}else if( yaxis !== this.yaxis ) {
this.emit( 'Y', yaxis, this.yaxis )
this.yaxis = yaxis
}else{
var store = 1,
btnState = [],
mask = 1

for( var i = 0; i < 8; i++ ) {
var state = btnState[ i ] = (btns & mask) / mask,
prev  = this.btnState[ i ]

if( state !== prev ) {
this.emit( 'Button' + i, state, prev )
}

mask *= 2
}

this.btnState = btnState
}

},
inputs: {},
outputs:{
'X': { min:0, max:255 },
'Y': { min:0, max:255 },
'Button0': { min:0, max:1 },
'Button1': { min:0, max:1 },
'Button2': { min:0, max:1 },
'Button3': { min:0, max:1 },
'Button4': { min:0, max:1 },
'Button5': { min:0, max:1 },
'Button6': { min:0, max:1 },
'Button7': { min:0, max:1 },
}
}