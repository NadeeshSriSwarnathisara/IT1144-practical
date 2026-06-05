const friends=["venura ","sakuntha","shehan"];

console.log("printing array elements before change");

for (let key in friends ) {
	console.log(friends[key]);
}
console.log("printing array elements after change");

 friends[2]="sajan";
 for (let key in friends) {
	console.log(friends[key]);
 }