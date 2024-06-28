function greetUser(){
    const time= new Date().getHours();
    if (time<11) {
        return "Good Morning!";
        
    } else if(time<16){
        return "Good Afternoon!";
    }
    else{
        return "Good Evening!";
    }
}
document.getElementById("greet").innerHTML=greetUser();