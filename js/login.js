const handleLogin= async () =>{
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    const credential = btoa(`${username}:${password}`)
    try {
        const response = await fetch('https://learn.reboot01.com/api/auth/signin',{
               method: 'POST',
               headers: {
                'Authorization': `Basic ${credential}`,
                'Content-Type': 'application/json'

        }
        })
        if(response.ok){
            const token = await response.json()
            sessionStorage.setItem('token',token)
            window.location.href='profile.html'
        } else {
            document.getElementById('error-message').textContent='invalid username or password'
        }
    }
    catch(error){
        document.getElementById('error-message').textContent=error
    }
}
document.getElementById('loginForm').addEventListener('submit',function(evennt){
    evennt.preventDefault()
    handleLogin()
})