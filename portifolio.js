//greetings function
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

/*MAIN functions on the nav bar and display option*/

//#about,#experience,#certification,#education,#skills,#project,#contact