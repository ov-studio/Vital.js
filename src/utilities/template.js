
/*----------------------------------------------------------------
     Resource: Vital
     Script: utilities: template.js
     Author: vStudio
     Developer(s): Aviril, Mario, Tron
     DOC: 22/07/2022
     Desc: Template Utilities
----------------------------------------------------------------*/


//////////////////////
// Class: Template //
//////////////////////

const CTemplate = vNetworkify.util.createClass({})
vNetworkify.util.template = CProxy.public
CTemplate.private.buffer = {}



/////////////////////
// Static Members //
/////////////////////

// @Desc: Creates a fresh template from URL
CTemplate.public.addMethod("create", function(name, data) {
    if (!vNetworkify.util.isString(name) || !vNetworkify.util.isString(data) || CTemplate.private.buffer[name]) return false
    CTemplate.private.buffer[name] = CTemplate.public.createInstance(name, data)
    return CTemplate.private.buffer[name]
})

// @Desc: Creates a fresh template from URL
CTemplate.public.addMethod("destroy", function(name) {
    if (!vNetworkify.util.isString(name) || !CTemplate.private.buffer[name]) return false
    return CTemplate.private.buffer[name].destroy()
})


///////////////////////
// Instance Members //
///////////////////////

// @Desc: Instance constructor
vNetworkify.util.proxy.addMethod("constructor", function(self, data) {
    self.template = document.createElement("template")
    self.template.innerHTML = data
}, "isInstance")


vNetworkify.util.proxy.addMethod("destroy", function(self) {
    // TODO: WIP DESTROY IT..
})


// TODO: WIP...
var template = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, minimum-scale=1.0">
  <title>browserify-example</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <script type="text/javascript" src="vnetworkify-client.js"></script>
  <script type="text/javascript" src="test.js"></script>
  <h1 :test="1">Testing</h1>
</body>
</html>
`

console.log(template)