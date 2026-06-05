const friends=["venura ","sakuntha","shehan"];


console.log("add another element");
friends.push("abhiman");
for (let key in friends ) {
	console.log(friends[key]);
}// output venura ,sakuntha,shehan,abhiman

console.log(" remove last element");
friends.pop();
for (let key in friends ) {
	console.log(friends[key]);
}// output venura ,sakuntha,shehan,