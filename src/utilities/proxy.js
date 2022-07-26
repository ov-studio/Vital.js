
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

const CProxy = vKit.Class()
vKit.proxy = CProxy.public


/////////////////////
// Static Members //
/////////////////////

// @Desc: Creates a fresh proxy of desired object/class
CProxy.public.addMethod("create", (data, exec) => {
    if ((!vKit.isObject(data) || !vKit.isClass(data)) || !vKit.isFunction(exec)) return false
    return CProxy.public.createInstance(data, exec)
})

// @Desc: Initializes a proxy instance
CProxy.private.onInitialize = (self, data) => {
    const private = CProxy.instance.get(self)
    const cProxy = Proxy.revocable(data, {
        set(data, property, value) {
            data[property] = value
            private.exec(data, property, value)
            return true
        },
        get(data, property) {
            const value = data[property]
            if (vKit.isObject(value)) {
                if (!private.buffer.has(value)) private.buffer.set(value, CProxy.private.onInitialize(self, value, private.exec))
                return private.buffer.get(value)
            }
            return value
        },
        deleteProperty(data, property) {
            const value = data[property]
            if (vKit.isObject(value) && private.buffer.has(value)) private.buffer.delete(value)
            return true
        }
    })
    private.revoke.push(cProxy.revoke)
    return cProxy.proxy
}


///////////////////////
// Instance Members //
///////////////////////

// @Desc: Instance constructor
CProxy.public.addMethod("constructor", (self, data, exec) => {
    const private = CProxy.instance.get(self)
    private.buffer = new WeakMap(), private.revoke = []
    private.data = data, private.exec = exec
    private.proxy = CProxy.private.onInitialize(self, private.data)
})

// @Desc: Destroys the instance
CProxy.public.addInstanceMethod("destroy", (self) => {
    const private = CProxy.instance.get(self)
    for (const i in private.revoke) {
        private.revoke[i]()
    }
    self.destroyInstance()
    return true
})