
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

const CProxy = vNetworkify.utility.createClass({})
vNetworkify.utility.proxy = CProxy.public


/////////////////////
// Static Members //
/////////////////////

// @Desc: Creates a fresh proxy on desired object/class
CProxy.public.addMethod("create", function(data, exec) {
    if ((!vNetworkify.utility.isObject(data) && !vNetworkify.utility.isClass(data)) || !vNetworkify.utility.isFunction(exec)) return false
    return new CProxy(data, exec)
})


///////////////////////
// Instance Members //
///////////////////////

// @Desc: Initializes a proxy instance
CProxy.private.onInitialize = function(self, data) {
    const cProxy = Proxy.revocable(data, {
        set(data, property, value) {
            data[property] = value
            self.exec(data, property, value)
            return true
        },
        get(data, property) {
            const value = data[property]
            if (vNetworkify.utility.isObject(value)) {
                if (!self.buffer.has(value)) self.buffer.set(value, CProxy.private.onInitialize(self, value, self.exec))
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
    self.revoke.push(cProxy.revoke)
    return cProxy.proxy
}

// @Desc: Instance constructor
CProxy.public.addMethod("constructor", function(self, data, exec) {
    self.buffer = new WeakMap(), self.revoke = []
    self.data = data, self.exec = exec
    self.proxy = CProxy.private.onInitialize(self, self.data)
}, "isInstance")

// @Desc: Verifies instance's validity
CProxy.public.addInstanceMethod("isInstance", function(self) {
    return (!self.isUnloaded && true) || false
})

// @Desc: Destroys the instance
CProxy.public.addInstanceMethod("destroy", function(self) {
    self.isUnloaded = true
    for (const i in self.revoke) {
        self.revoke[i]()
    }
    delete self.buffer
    return true
})