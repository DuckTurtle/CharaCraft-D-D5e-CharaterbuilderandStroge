
const signUp = async (event) => {
    event.preventDefault();
    const username = document.querySelector('#username').value.trim();
    const email = document.querySelector('#email').value.trim();
    const password = document.querySelector('#password').value.trim();
const response = await fetch('/api/users/', {
    method: 'POST',
    body: JSON.stringify({username, email, password }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    document.location.replace('/login');
  } else {
    alert(response.statusText);
  }
};

//sign up for user
document
.querySelector('#signUpForm')
.addEventListener('submit', signUp);

