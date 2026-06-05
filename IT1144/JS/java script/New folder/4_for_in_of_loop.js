
console.log("--- For-In Loop (Objects/Keys) ---");
const student = { name: "Nadeesh", course: "IT", year: 2 };
for (let key in student) {
    console.log(`${key}: ${student[key]}`);
}

console.log("\n--- For-Of Loop (Array Values) ---");
const numbers = [1, 2, 3, 4, 5];
for (let num of numbers) {
    console.log(num);
}
