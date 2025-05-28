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

document.getElementById('formulario').addEventListener('submit', async e => {
  e.preventDefault();
  const usuario = document.getElementById('usuario').value.trim();
  const contrasena = document.getElementById('contrasena').value;

  const endpoint = isLogin ? '/login' : '/register';

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, contrasena })
    });

    const data = await res.json();

    if (res.ok) {
      if (isLogin) {
        alert('Inicio de sesión correcto');
        // window.location.href = "productos.html";
      } else {
        alert('Usuario registrado con éxito');
      }
    } else {
      alert(data.mensaje || 'Ocurrió un error');
    }
  } catch (error) {
    alert('Error al conectar con el servidor');
  }
});
