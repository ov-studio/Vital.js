
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

// @Desc: Creates a object/class's proxy
vNetworkify.utility.createProxy = function(data, exec) {
    if ((!vNetworkify.utility.isObject(data) && !vNetworkify.utility.isClass(data)) || !vNetworkify.utility.isFunction(exec)) return false
    const cBuffer = new WeakMap()
    return new Proxy(data, {
        set(data, property, value) {
            data[property] = value
            exec(data, property, value)
            return true
        },
        get(data, property) {
            const value = data[property]
            if (vNetworkify.utility.isObject(value)) {
                if (!cBuffer.has(value)) cBuffer.set(value, createProxy(value, exec))
                return cBuffer.get(value)
            }
            return value
        },
        deleteProperty(data, property) {
            const value = data[property]
            if (vNetworkify.utility.isObject(value) && cBuffer.has(value)) cBuffer.delete(value)
            return true
        }
    })
}