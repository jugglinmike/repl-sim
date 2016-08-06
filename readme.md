# ReplSim

A utility for animating text in HTML documents to simulate REPL interactions.

## Usage

ReplSim is defined using UMD, so it may be included in AMD environments,
CommonJS environments, or as a property of the global scope. The exported value
is a constructor function that is intended to be invoked with a DOM node
containing REPL-like text and an optional object of settings to modify the
behavior.

```js
var el = document.getElementById('code-example');
var options = {
  // A RegExp describing which lines should be considered input. Text following
  // the prompt will be animated as if entered via a keyboard. Non-matching
  // lines will be printed to the screen immediately as if output by an
  // automated process.
  promptRe: /^\$ /,

  // The amount of time (in milliseconds) to "blink" the cursor.
  cursorPeriod: 700,

  // The amount of time (in milliseconds) to pause at the end of a line of
  // input before simulating "submiting" and moving to the next line.
  submitDelay: 800,

  // The mount of time (in milliseconds) to pause after printing an input
  // prompt before animating the following text input
  readDelay: 1000,

  // Function to retrieve the height of a current element; this will be used to
  // ensure the container does not change in size over the course of the
  // animation.
  getHeight: function(el) {
    return el.clientHeight;
  },

  // Function that returns the amount of time (in milliseconds) to delay
  // between each keystroke. This is called for every key stroke to support
  // dynamic values, such as those produced by `Math.random`.
  keystrokeDelay: function() {
    return 50 + Math.random() * 100;
  }
};

var rs = new ReplSim(el, options);
rs.play();
```

Instances support the following methods:

- `play()` - begin the animation; returns a Promise which is fulfilled when the
  animation is complete
- `destroy()` - cancel animation; useful when the containing markup must be
  removed from the DOM; the animation cannot be re-started after this method is
  invoked

To repeat animation indefinitely, chain off of the Promise returned by `play`,
e.g.

```js
var rs = new ReplSim(el, options);
(function repeat() {
  rs.play().then(repeat);
}());
```

## License

Copyright 2016 Mike Pennisi under [the GNU General Public License
v3.0](https://www.gnu.org/licenses/gpl-3.0.html)
