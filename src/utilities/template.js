
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

const CTemplate = vKit.Class()
vKit.template = CTemplate.public
CTemplate.private.buffer = {}


/////////////////////
// Static Members //
/////////////////////

// @Desc: Creates a fresh template from URL
CTemplate.public.addMethod("create", (name, data) => {
    if (!vKit.isString(name) || !vKit.isString(data) || CTemplate.private.buffer[name]) return false
    CTemplate.private.buffer[name] = CTemplate.public.createInstance(name, data)
    return CTemplate.private.buffer[name]
})

// @Desc: Creates a fresh template from URL
CTemplate.public.addMethod("destroy", (name) => {
    if (!vKit.isString(name) || !CTemplate.private.buffer[name]) return false
    return CTemplate.private.buffer[name].destroy()
})


///////////////////////
// Instance Members //
///////////////////////

// @Desc: Instance constructor
CTemplate.public.addMethod("constructor", (self, data) => {
    const private = CTemplate.instance.get(self)
    private.template = document.createElement("template")
    private.template.innerHTML = data
})


// @Desc: Destroys the instance
CTemplate.public.addInstanceMethod("destroy", (self) => {
    const private = CTemplate.instance.get(self)
    // TODO: WIP DESTROY IT..
    self.destroyInstance()
    return true
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
  <script type="text/javascript" src="vNetwork-client.js"></script>
  <script type="text/javascript" src="test.js"></script>
  <h1 :test="1">Testing</h1>
</body>
</html>
`

//console.log(template)