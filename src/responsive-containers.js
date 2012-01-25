/*
MIT Licensed.
Copyright (c) 2011 Andy Hume (http://andyhume.net, andyhume@gmail.com).
 
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

(function(win) {

    var doc = win.document,
        els = [],
        loaded = false;

    function findContainerQueries() {
        // Find data-squery attributes.
        if (doc.querySelectorAll) {
            els = doc.querySelectorAll("[data-squery]");
        } else {
            // If no query selectors.
            var e = doc.getElementsByTagName("*");
            for (var i = 0, j = e.length; i<j; ++i) {
                if (e[i].getAttribute("data-squery")) {
                    els.push(e[i]);
                }
            }
        }

        // Parse the data-squery attribute and store resulting rules on the element.
        for (var i = 0, j = els.length; i<j; ++i) {
            var el = els[i];
            var cq_rules = [];
            var raw_rules = el.getAttribute("data-squery").split(" ");
            for (var k = 0, l = raw_rules.length; k<l; ++k) {
                var rule = /(.*):([0-9]*)(px|em)=(.*)/.exec(raw_rules[k]);
                if (rule) {
                    cq_rules.push(rule);
                }
            }
            el.cq_rules = cq_rules;
        }
    }

    function applyRules() {
        // For each element, apply the rules to the class name.
        for (var i = 0, j = els.length; i<j; ++i) {
            el = els[i];
            for (var k = 0, l = el.cq_rules.length; k<l; ++k) {
                var rule = el.cq_rules[k];

                // Get a target width value in pixels.
                var width = parseInt(rule[2]);
                if (rule[3] === "em") {
                    width = emsToPixels(parseFloat(rule[2]), el);
                }

                // Test current width against target width and add/remove class values.
                if ( compareFunction[rule[1]](el.offsetWidth, width) ) {
                    if (el.className.indexOf(rule[4]) < 0) {
                        el.className += " " + rule[4];
                    }
                } else {
                    el.className = (" " + el.className + " ").replace(" " + rule[4] + " ", " ");
                }
            }
        }
    }

    var compareFunction = {
        "min-width": function(a, b) {
            return a > b;
        },
        "max-width": function(a, b) {
            return a < b;
        }
    }

    function contentReady() {
        if (loaded) {
            return;
        }
        loaded = true;
        findContainerQueries();
        applyRules();
        if (win.addEventListener) {
            win.addEventListener("resize", applyRules, false);
        }
        // Allow for resizing text after the page has loaded.
        var current_em = emsToPixels(1, doc.body);
        win.setInterval(function() {
            var new_em = emsToPixels(1, doc.body);
            if (new_em !== current_em) {
                applyRules();
                current_em = new_em;
            }
        }, 100);
    }

    function memoize( f ) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            f.memoize = f.memoize || {};
            return (args in f.memoize) ? f.memoize[args] : f.memoize[args] = f.apply(this, args);
        };
    }

    var emsToPixels = memoize(function(em, scope) {
        var test = doc.createElement("div");
        test.style.fontSize = "1em";
        test.style.margin = "0";
        test.style.padding = "0";
        test.style.border = "none";
        test.style.width = "1em";
        scope.appendChild(test);
        var val = test.offsetWidth;
        scope.removeChild(test);
        return Math.round(val * em);
    });

    if (doc.addEventListener) {
        doc.addEventListener("DOMContentLoaded", contentReady, false);
        // or
        win.addEventListener("load", contentReady, false);
    }
    // If old IE
    else if (doc.attachEvent) {
        doc.attachEvent("onreadystatechange", contentReady);
        // or
        win.attachEvent("onload", contentReady);
    }

})(this);