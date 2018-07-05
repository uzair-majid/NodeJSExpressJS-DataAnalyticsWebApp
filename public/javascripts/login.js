window.onload = function ()
{
  
} 


function signupvalidations() {
   // e.preventDefault();
    var fname = $("#fname").val();
    var lname = $("#lname").val();
    var pass = $("#pw-r").val();
    var cpass = $("#cpw").val();
    var uname = $("#username").val();
    var email = $("#email-r").val();
    check = true;
    if (fname == "") {
        var msg = "First name field is empty!"
        alert(msg);
        check = false;
    } if (lname == "") {
        var msg = "Last name field is empty!"
        alert(msg);
        check = false;
    }
    if (pass !== cpass) {
        var msg= "passwords do not match!"
        alert(msg);
        check = false;
    }
    if (pass == "") {
        var msg = "password field is empty!"
        alert(msg);
        check = false;
    }
    if (uname=="") {
        var msg = "Username field is empty!"
        alert(msg);
        check = false;
    }
    if (email == "") {
        var msg = "email field is empty!"
        alert(msg);
        check = false;
    }
    var user = { email: $('#email-r').val(), uname: $('#username').val(), pass: $('#pw-r').val() };

    if (check == true) {
        $.ajax({
            async: false,
            type: 'POST',
            data: user,
            dataType: "json",
            url: '/register',
            success: function (data) {
              //  alert(data.success);
                //  console.log('success');
                var isRegistered = data.success;
               // alert(isRegistered);
                if (isRegistered==false) {
                    alert("username or email already exists");
                    check = false;
                }
                else {
                    alert("Hi ," + user.uname + " you can now login to proceed!");
                    check = false
                }

               // alert("abc");

                

               

            },
            error: function () {
                alert('error!');
            }


        });
    }
    var s = check;
    return s;

    }
    
  


 
  
function loginvalidations() {
    // e.preventDefault();
    var pass = $("#pw-l").val();
    var email = $("#email-l").val();
    check = true;
   
    if (pass == "") {
        var msg = "password field is empty!"
        alert(msg);
        check = false;
    }
    
    if (email == "") {
        var msg = "email field is empty!"
        alert(msg);
        check = false;
    }

    if (check == true) {
        var user = { email: email, password:pass }
        $.ajax({
            async: false,
            type: 'POST',
            data: user,
            dataType: "json",
            url: '/checkuser',
            success: function (data) {
                //  alert(data.success);
                //  console.log('success');
                var isRegistered = data.success;
               // alert(isRegistered);
                if (isRegistered == false) {
                    alert("email or password is incorrect");
                    check = false;
                }
                else {
                   // alert("Hi ," + user.uname + " you can now login to proceed!");
                    check = true;
                }

                // alert("abc");





            },
            error: function () {
                alert('error!');
            }


        });
        
    }
    return check;
}

 