const fruits=["apple","banana","cherry"];
/*console.log(fruits[0]);
fruits[1]="grape";
console.log(fruits[1]);
console.log(fruits[2]);*/

console.log("printing array elements");
console.log(fruits[0]);
console.log(fruits[1]);
console.log(fruits[2]);

console.log("printing array elements using for loop");
for (let key in fruits) {
	console.log(fruits[key]);
}