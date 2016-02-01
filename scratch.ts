// Define an object that contains a divisor property and
// a remainder function.
var obj = {
    divisor: 10,
    remainder: function (value) {
        return value % this.divisor;
    }
}

// Create an array.
var numbers = [6, 12, 25, 30];

// Get the remainders.
// The obj argument specifies the this value in the callback function.
var result = numbers.map(obj.remainder, obj);
document.write(result);

// Output:
// 6,2,5,0


var kvArray = [{key:1, value:10}, {key:2, value:20}, {key:3, value: 30}];
var reformattedArray = kvArray.map(function(obj){ 
   var rObj = {};
   rObj[obj.key] = obj.value;
   return rObj;
});
// reformattedArray is now [{1:10}, {2:20}, {3:30}], 
// kvArray is still [{key:1, value:10}, {key:2, value:20}, {key:3, value: 30}]

var numbers = [1, 4, 9];
var doubles = numbers.map(function(num) {
  return num * 2;
});
// doubles is now [2, 8, 18]. numbers is still [1, 4, 9]
