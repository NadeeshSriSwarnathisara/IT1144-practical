
const stu_name="nadeesh";
let stu_age=21;
let registered = true;
let marks = 5;

console.log(stu_name);
console.log(stu_age);
console.log(registered);
console.log(marks);

if (marks>75){
	console.log("A");
	
}
else if (marks>65){
	console.log("B");
}
else if (marks>50){
	console.log("C");
}
else (marks<50)
	console.log("F");


 const subject=["Maths","Science","English","ICT"];
  for (let key in subject) {
	console.log(subject[key]);
 }
 

 
 function stumarkstotal(mark1, mark2){
	 return mark1 + mark2;
	 
 }
 let total =stumarkstotal(65 + 76);
 console.log("total marks= " + total);

