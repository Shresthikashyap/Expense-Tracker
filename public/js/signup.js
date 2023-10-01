
const save = async(event)=>{ 
    try{
    event.preventDefault(); 
    const name = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
 
    const obj= {
    name,email,password
    }
       
<<<<<<< HEAD
        let response = await axios.post("http://localhost:3000/users/signup",obj);
=======
        let response = await axios.post("http://13.51.197.130/users/signup",obj);
>>>>>>> 1f745c996828bb051060adfacf8da470d11aa456
       // console.log(obj.id)
        localStorage.setItem('token',response.data.token)
        window.location.href = 'Expense Tracker.html';
        }
        catch(err){
            document.getElementById('failure').innerHTML = `Error: ${ err.response.data.error}`;
        }
    }