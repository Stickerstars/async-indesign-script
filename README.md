# async-indesign-script
Talk to ID from node and get a callback.

## Quickstart
```
const path = require('path');
const InDesign = require('async-indesign-script');

const id = new InDesign();
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
 * Main.
 */

var responder = new NodeResponder();

/**
 * Tell node we're finished.
 */
responder.emit({
    message: 'YOUR DATA'
});
```