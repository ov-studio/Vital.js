
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

vNetworkify.utility.template = vNetworkify.utility.createClass({
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


///////////////////////
// Instance Members //
///////////////////////

// @Desc: Instance constructor
vNetworkify.utility.proxy.addMethod("constructor", function(self, data) {
    self.template = document.createElement("template")
    self.template.innerHTML = data
}, "isInstance")


vNetworkify.utility.proxy.addMethod("destroy", function(self) {
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