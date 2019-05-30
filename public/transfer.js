let input = document.getElementById("credit");
let inputVal;

input.addEventListener("click",function(){
    input.value = "";
})
input.addEventListener("blur",function(){
    input.value = "0" ;
})

input.addEventListener("change",function(){
    console.log(input.value);
    inputVal = input.value;
})

let btn1 = document.getElementsByTagName("button");

btn1[0].addEventListener("click",function(){
    input.value = inputVal;
})
