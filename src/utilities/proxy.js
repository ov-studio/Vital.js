
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

vNetworkify.utility.proxy = CUtility.createClass({})


/////////////////////
// Static Members //
/////////////////////

// @Desc: Creates a fresh proxy on desired object/class
vNetworkify.utility.proxy.addMethod("create", function(data, exec) {
    if ((!vNetworkify.utility.isObject(data) && !vNetworkify.utility.isClass(data)) || !vNetworkify.utility.isFunction(exec)) return false
    return new vNetworkify.utility.proxy(data, exec)
})


///////////////////////
// Instance Members //
//////////////////////

// @Desc: Instance Constructor
vNetworkify.utility.proxy.addMethod("constructor", function(self, data, exec) {
    self.buffer = new WeakMap()
    {self.proxy, self.revoke} = Proxy.revocable(data, {
        set(data, property, value) {
            data[property] = value
            exec(data, property, value)
            return true
        },
        get(data, property) {
            const value = data[property]
            if (vNetworkify.utility.isObject(value)) {
                if (!self.buffer.has(value)) self.buffer.set(value, createProxy(value, exec))
                return self.buffer.get(value)
            }
            return value
        },
        deleteProperty(data, property) {
            const value = data[property]
            if (vNetworkify.utility.isObject(value) && self.buffer.has(value)) self.buffer.delete(value)
            return true
        }
    })
}, "isInstance")

// @Desc: Verifies instance's validity
vNetworkify.utility.proxy.addInstanceMethod("isInstance", function(self) {
    return (!self.isUnloaded && true) || false
})

// @Desc: Destroys the instance
vNetworkify.utility.proxy.addInstanceMethod("destroy", function(self) {
    self.isUnloaded = true
    self.revoke()
    delete self.buffer
    return true
})