
const save = async(event)=>{ 
    try{
    event.preventDefault(); 
    const name = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
 
    const obj= {
    name,email,password
    }
       
        let response = await axios.post("http://localhost:3000/users/signup",obj);
       // console.log(obj.id)
        localStorage.setItem('token',response.data.token)
        window.location.href = 'Expense Tracker.html';
        }
        catch(err){
            document.getElementById('failure').innerHTML = `Error: ${ err.response.data.error}`;
        }
    }