(function(win) {

    var doc = win.document,
        els = [],
        loaded = false;

    function findContainerQueries() {
        // Find data-squery attributes.
        if (doc.querySelectorAll) {
            els = document.querySelectorAll("[data-squery]");
        } else {
            // If no query selectors.
            var e = document.getElementsByTagName("*");
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
                var rule = /(.*):([0-9]*)=(.*)/.exec(raw_rules[k]);
                cq_rules.push(rule);
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
                if ( compareFunction[rule[1]](el.offsetWidth, parseInt(rule[2])) ) {
                    if (el.className.indexOf(rule[3]) < 0) {
                        el.className += " " + rule[3];
                    }
                } else {
                    el.className = (" " + el.className + " ").replace(" " + rule[3] + " ", " ");
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
        if (doc.addEventListener) {
            win.addEventListener("resize", applyRules, false);
        }
    }

    if (doc.addEventListener) {
        document.addEventListener("DOMContentLoaded", contentReady, false);
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