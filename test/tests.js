window.onload = function() {
    
    var test_small = document.getElementById("test-small");
    var test_big = document.getElementById("test-big");
    
    test("big element has a wide class name", function() {
        ok(test_big.className.indexOf("wide"), "Value should be wide");
    });
    
    test("small element has no wide class name", function() {
        equal(test_small.className.indexOf("wide"), -1, "Value should not be wide");
    });
}