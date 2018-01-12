//@include NodeResponder.jsx

alert(data);

/**
 * Main.
 */

var bus = new NodeResponder();

/**
 * Tell node we're finished.
 */
bus.emit({
    message: 'YOUR DATA'
});