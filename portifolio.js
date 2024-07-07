function greetUser(){
    const time= new Date().getHours();
    if (time<=11) {
        return "Hello, Good Morning!";
        
    } else if(time<=16){
        return "Hello, Good Afternoon!";
    }
    else{
        return "Hello, Good Evening!";
    }
}
document.getElementById("greet").innerHTML=greetUser();