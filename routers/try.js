function power(exp) {
    return function(val) {
        console.log(val+exp);
    }
}

power(11)(7);