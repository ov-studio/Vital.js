
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

vNetworkify.utility.proxy = vNetworkify.utility.createClass({})


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
///////////////////////

function createProxy(self, data) {
    const cProxy = Proxy.revocable(data, {
        set(data, property, value) {
            data[property] = value
            self.exec(data, property, value)
            return true
        },
        get(data, property) {
            const value = data[property]
            if (vNetworkify.utility.isObject(value)) {
                if (!self.buffer.has(value)) self.buffer.set(value, createProxy(self, value, self.exec))
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

// @Desc: Instance Constructor
vNetworkify.utility.proxy.addMethod("constructor", function(self, data, exec) {
    self.buffer = new WeakMap(), self.revoke = []
    self.data = data, self.exec = exec
    self.proxy = createProxy(self, self.data)
}, "isInstance")

// @Desc: Verifies instance's validity
vNetworkify.utility.proxy.addInstanceMethod("isInstance", function(self) {
    return (!self.isUnloaded && true) || false
})

// @Desc: Destroys the instance
vNetworkify.utility.proxy.addInstanceMethod("destroy", function(self) {
    self.isUnloaded = true
    for (const i in self.revoke) {
        const j = self.revoke[i]
        j()
    }
    delete self.buffer
    return true
})


// TODO: WIP USAGE
const test = {
    testA: "valueA",
    testB: {
        testC: "valueC"
    }
}
const wew = vNetworkify.utility.proxy.create(test, function(_, property, value) {
    console.log(property, value)
})
wew.proxy.testNew = "llll"
wew.proxy.testB.testD = "lol"
console.log(test)
console.log(wew.proxy)