
/*----------------------------------------------------------------
     Resource: Vital
     Script: utilities: vcl.js
     Author: vStudio
     Developer(s): Aviril, Mario, Tron
     DOC: 22/07/2022
     Desc: VCL Utilities
----------------------------------------------------------------*/


/////////////////
// Class: VCL //
/////////////////

CVCL = vNetworkify.util.createClass()
vNetworkify.util.vcl = CVCL.public
CVCL.private.types = {
    init: ":",
    comment: "#",
    tab: "\t",
    space: " ",
    newline: "\n",
    carriageline: "\r",
    list: "-",
    negative: "-",
    decimal: ".",
    bool: {
        ["true"]: "true",
        ["false"]: "false"
    },
    string: {
        ["`"]: true,
        ["'"]: true,
        ["\""]: true
    }
}


/////////////////////
// Static Members //
/////////////////////

// @Desc: Creates a fresh template from URL
CVCL.public.addMethod("create", function(name, data) {
    if (!vNetworkify.util.isString(name) || !vNetworkify.util.isString(data) || CVCL.public.buffer[name]) return false
    CVCL.public.buffer[name] = new vNetworkify.util.template(name, data)
    return CVCL.public.buffer[name]
})

// @Desc: Creates a fresh template from URL
CVCL.public.addMethod("destroy", function(name) {
    if (!vNetworkify.util.isString(name) || !vNetworkify.util.isObject(CVCL.public.buffer[name])) return false
    return CVCL.public.buffer[name].destroy()
})

