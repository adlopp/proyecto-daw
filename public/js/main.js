const toggleBtn = document.getElementById('toggle-form');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');

let isLogin = false;

toggleBtn.addEventListener('click', () => {
  isLogin = !isLogin;

  if (isLogin) {
    formTitle.textContent = 'Iniciar sesión';
    submitBtn.textContent = 'Entrar';
    toggleBtn.textContent = '¿No tienes cuenta? Regístrate';
  } else {
    formTitle.textContent = 'Crear una cuenta';
    submitBtn.textContent = 'Registrarse';
    toggleBtn.textContent = '¿Ya tienes una cuenta?';
  }
});
