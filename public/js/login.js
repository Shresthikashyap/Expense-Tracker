const save = async (event) => {
    try{
        event.preventDefault();

        const email = event.target.email.value;
        const password = event.target.password.value;
     
        const obj= {
        email,password
        }
        
<<<<<<< HEAD
        let response = await axios.post("http://localhost:3000/users/login",obj);
=======
        let response = await axios.post("http://13.51.197.130/users/login",obj);
>>>>>>> 1f745c996828bb051060adfacf8da470d11aa456

        localStorage.setItem('token',response.data.token)
 
        window.location.href = 'Expense Tracker.html';
        
        //document.getElementById('success').innerHTML = `${response.data.message}`;
    }
    catch(err){
        document.getElementById('failure').innerHTML = `Error: ${err.response.data.error}`;
    }
}