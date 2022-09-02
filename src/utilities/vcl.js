
/*----------------------------------------------------------------
     Resource: Vital
     Script: utilities: vcl.js
     Author: vStudio
     Developer(s): Aviril, Mario, Tron
     DOC: 22/07/2022
     Desc: VCL Utilities
----------------------------------------------------------------*/


//////////////////////
// Class: Template //
//////////////////////

vNetworkify.utility.vcl = vNetworkify.utility.createClass({
    buffer: {}
})


/////////////////////
// Static Members //
/////////////////////

// @Desc: Creates a fresh template from URL
vNetworkify.utility.template.addMethod("create", function(name, data) {
    if (!vNetworkify.utility.isString(name) || !vNetworkify.utility.isString(data) || vNetworkify.utility.template.buffer[name]) return false
    vNetworkify.utility.template.buffer[name] = new vNetworkify.utility.template(name, data)
    return vNetworkify.utility.template.buffer[name]
})

// @Desc: Creates a fresh template from URL
vNetworkify.utility.template.addMethod("destroy", function(name) {
    if (!vNetworkify.utility.isString(name) || !vNetworkify.utility.isObject(vNetworkify.utility.template.buffer[name])) return false
    return vNetworkify.utility.template.buffer[name].destroy()
})

console.log("bump")