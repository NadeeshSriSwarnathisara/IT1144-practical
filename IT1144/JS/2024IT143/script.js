 function querySelector()
 {
	
	  let name = document.getElementById("name").value.trim();
      let email = document.getElementById("email").value.trim();
      let phone = document.getElementById("phone").value.trim();
      let room = document.getElementById("room").value;
      let payment = document.querySelector("input[name='payment']:checked");
	 
	 
	 let paymentMethod= payment? payment.value:"not selected";
	 
document.getElementById("result").innerHTML=
 " <p>Name:" + name + "</p>"+
  " <p>Email:" + email + "</p>"+
   "<p>Phone:" + phone  + "</p>"+
     " <p>Room: "+ room+ "</p>"+
 " <p>Payment Method:" +paymentmethod + "</p>";
  
    alert("Order Successfully" );




)


