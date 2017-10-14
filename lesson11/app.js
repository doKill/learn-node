var parent = function () {
    var name = "parent_name";
    var age = 13;
  
    var child = function () {
      var name = "child_name";
      var childAge = 0.3;
  
      // => child_name 13 0.3
      console.log(name, age, childAge);
    };
  
    child();
  
    // will throw Error
    // ReferenceError: childAge is not defined
    console.log(name, age, childAge);
  };
  
  parent();