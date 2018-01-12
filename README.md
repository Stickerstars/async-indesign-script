# async-indesign-script
Talk to InDesign from node and get a callback. Mac only.

## Quickstart
```
const path = require('path');
const InDesign = require('async-indesign-script');

const id = new InDesign({
    version: 'CC 2018'
});
id.run(path.join(__dirname, 'example.jsx'), {
    message: 'hi from node'
}, function(res) {
    console.log(res);
});
```

adobe jsx-script file
```
//@include async-indesign-script/src/jsx/NodeResponder.jsx

alert(data);

/**
 * Synchronous code...
 */

var responder = new NodeResponder();

/**
 * Tell node we're finished.
 */
responder.emit({
    message: 'YOUR DATA'
});
```