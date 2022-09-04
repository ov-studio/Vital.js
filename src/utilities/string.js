
/*----------------------------------------------------------------
     Resource: Vital
     Script: utilities: string.js
     Author: vStudio
     Developer(s): Aviril, Mario, Tron
     DOC: 22/07/2022
     Desc: String Utilities
----------------------------------------------------------------*/


/////////////////
// Class: VCL //
/////////////////

const CString = vNetworkify.util.createClass()
vNetworkify.util.string = CString.public

CString.public.isVoid = (baseString) => {
    if (!baseString || (typeof(baseString) != "string")) return false
    baseString = baseString.replaceAll(/[\n\r\t\s]/g, "")
    return (!baseString.match(/[\W\w]/g) && true) || false
}