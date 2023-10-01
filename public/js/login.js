const save = async (event) => {
    try{
        event.preventDefault();

        const email = event.target.email.value;
        const password = event.target.password.value;
     
        const obj= {
        email,password
        }
        
        let response = await axios.post("http://13.51.156.137:3000/users/login",obj);

        localStorage.setItem('token',response.data.token)
 
        window.location.href = 'Expense Tracker.html';
        
        //document.getElementById('success').innerHTML = `${response.data.message}`;
    }
    catch(err){
        document.getElementById('failure').innerHTML = `Error: ${err.response.data.error}`;
    }
}