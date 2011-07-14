(function(win) {
    
    var doc = win.document,
        els = [],
        loaded = false;
    
    function findContainerQueries() {
        // Find data-cq attributes.
        if (doc.querySelectorAll) {
            els = document.querySelectorAll("[data-cq]");
        } else {
            // If no query selectors.
            var e = document.getElementsByTagName("*");
            for (var i = 0, j = e.length; i<j; ++i) {
                if (e[i].getAttribute("data-cq")) {
                    els.push(e[i]);
                }
            }
        }

        // Parse the data-cq attribute and store resulting rules on the element.
        for (var i = 0, j = els.length; i<j; ++i) {
            var el = els[i];
            var cq_rules = [];
            //alert(el.className);
            var raw_rules = el.getAttribute("data-cq").split(" ");
            for (var k = 0, l = raw_rules.length; k<l; ++k) {
                var rule = /(.*):(.*)=(.*)/.exec(raw_rules[k]);
                cq_rules.push(rule);
            }
            el.cq_rules = cq_rules;
        }
    }
    
    function applyRules() {
        // For each element we found, apply the rules to the class name.
        for (var i = 0, j = els.length; i<j; ++i) {
            el = els[i];
            for (var k = 0, l = el.cq_rules.length; k<l; ++k) {
                var rule = el.cq_rules[k];
                var compareFunction = getCompareFunction(rule[1]);
                if ( compareFunction(el.offsetWidth, parseInt(rule[2])) ) {
                    if (el.className.indexOf(rule[3]) < 0) {
                        el.className += " " + rule[3];
                    }
                } else {
                    el.className = (" " + el.className + " ").replace(" " + rule[3] + " ", " ");
                }
            }
        }
    }
    
    function getCompareFunction(type) {
        switch(type) {
            case "min-width":
                return function(a, b) {
                    return a > b;
                }
                break;
            case "max-width":
                return function(a, b) {
                    return a < b;
                }
                break;
        }
    }
    
    function contentReady() {
        if (loaded) {
            return;
        }
        loaded = true;
        findContainerQueries();
        applyRules();
        win.addEventListener("resize", applyRules, false);
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
