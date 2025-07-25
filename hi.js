// console.log("A" -1);
// console.log('2'-2-'2');
// const a = {}
// const b = {
//     name:'pranav'
// }
// const d = {
//     name:'jsva'
// }
// const c = {
//     name:'vaishnav'
// }
// a[b] = {
//     name:'ankit'
// }
// a[c] ={
//     name:'tilak'
// }
// a[d] = {
//     name:'pranav'
// }
// a[b] = {
//     name:'ankit'
// }

// console.log(a[b])

// const y = 0 ;
// const z = false;
// console.log(y == z);
// console.log(y === z);
// console.log( "abs"/2);
// console.log(NaN == NaN);
// console.log(NaN === NaN);
// let arr = [1,2,3,4,5,7,8,0];
// let result = arr.map((item , idx) => {
//     return item>2;
// })
// console.log(result);
// const arr1 = [100, 50 , 200 , 150];
// arr1.sort();
// console.log(arr1);
// arr1.sort((a,b) => {
//     return a-b;
// }) 
// console.log(arr1);
let body = document.querySelector("body")
let btn = document.querySelector("#button");
btn.addEventListener("click", () => {
    alert("btn clicked");
    body.style.backgroundColor = "red";
});
