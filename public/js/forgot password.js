const forgotpassword = async(event) => {
    event.preventDefault();

    const form = new FormData(event.target);
    
    const userDetails = {
        email : form.get('email')
    }

    console.log('user details',userDetails)
<<<<<<< HEAD
    axios.post('http://localhost:3000/password/forgotpassword',userDetails).then(response => {
=======
    axios.post('http://13.51.197.130/password/forgotpassword',userDetails).then(response => {
>>>>>>> 1f745c996828bb051060adfacf8da470d11aa456
        console.log (response.status)
        if(response.status === 202){
            document.body.innerHTML += '<div style="color:red;">Mail Successfully sent <div>'
        } else {
            throw new Error('Something went wrong!!!')
        }
    }).catch(err => {
        console.log(err)
        document.body.innerHTML += `<div style="color:red;">${err} <div>`;
    })
}