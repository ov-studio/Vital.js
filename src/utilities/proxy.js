
/*----------------------------------------------------------------
     Resource: Vital
     Script: utilities: proxy.js
     Author: vStudio
     Developer(s): Aviril, Mario, Tron
     DOC: 22/07/2022
     Desc: Proxy Utilities
----------------------------------------------------------------*/


///////////////////
// Class: Proxy //
///////////////////

// @Desc: Creates a class/object's proxy
vNetworkify.utility.createProxy = function(object, exec) {
    if ((!vNetworkify.utility.isObject(object) && !vNetworkify.utility.isClass(object)) || !vNetworkify.utility.isFunction(exec)) return false
    const cBuffer = new WeakMap()
    return new Proxy(object, {
        set(object, property, value) {
            object[property] = value
            exec(object, property, value)
            return true
        },
        get(object, property) {
            const value = object[property]
            if (value && typeof value == "object") {
                if (!cBuffer.has(value)) cBuffer.set(value, createProxy(value, exec))
                return cBuffer.get(value)
            }
            return value
        },
        deleteProperty(object, property) {
            const value = object[property]
            if (value && typeof value == "object") {
                if (cBuffer.has(value)) cBuffer.delete(value)
            }
            return true
        }
    })
}