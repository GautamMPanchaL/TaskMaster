function checkPasswordMatch() {
        var password = $("#password").val();
        var confirmPassword = $("#cpassword").val();
        const input = document.getElementById("cpassword");
        // console.log(input);
        console.log(password);
        console.log(confirmPassword);
        if (password != confirmPassword){
            input.setCustomValidity("Not equal to Password");
            return false;
        }
        else
            input.setCustomValidity("");
            return true;
    }