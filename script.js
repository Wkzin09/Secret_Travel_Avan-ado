document.addEventListener("DOMContentLoaded", () => {
    // --- SELETORES ---
    const screens = {
        splash: document.getElementById('splash-screen'),
        login: document.getElementById('login-screen'),
        register: document.getElementById('register-screen'),
        forgot: document.getElementById('forgot-screen')
    };

    const startBtn = document.getElementById('start-btn');
    const goRegister = document.getElementById('go-register');
    const goForgot = document.getElementById('go-forgot');
    const goLoginBtns = document.querySelectorAll('.go-login');

    // --- BANCO DE DADOS LOCAL (Simulação) ---
    // Tenta carregar usuários existentes ou cria uma lista com um usuário padrão
    const getUsers = () => JSON.parse(localStorage.getItem('st_users')) || [
        { name: 'Admin User', email: 'admin@teste.com', password: '123456' }
    ];
    
    const saveUser = (user) => {
        const users = getUsers();
        users.push(user);
        localStorage.setItem('st_users', JSON.stringify(users));
    };

    // --- NAVEGAÇÃO ---
    function showScreen(screenKey) {
        Object.values(screens).forEach(s => {
            s.classList.add('hidden');
            s.classList.remove('active', 'fade-in');
        });
        screens[screenKey].classList.remove('hidden');
        setTimeout(() => screens[screenKey].classList.add('active', 'fade-in'), 10);
    }

    startBtn.addEventListener('click', () => {
        screens.splash.style.opacity = '0';
        setTimeout(() => showScreen('login'), 400);
    });

    goRegister.addEventListener('click', (e) => { e.preventDefault(); showScreen('register'); });
    goForgot.addEventListener('click', (e) => { e.preventDefault(); showScreen('forgot'); });
    goLoginBtns.forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); showScreen('login'); }));

    // --- FUNÇÕES DE AUXÍLIO (UI) ---
    const setBtnState = (btn, state, text) => {
        btn.disabled = (state === 'loading');
        if (state === 'loading') {
            btn.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i> Processando...`;
        } else if (state === 'success') {
            btn.style.backgroundColor = 'var(--success)';
            btn.innerHTML = `<i class="fas fa-check"></i> Pronto!`;
        } else if (state === 'error') {
            btn.style.backgroundColor = 'var(--error)';
            btn.innerHTML = `<i class="fas fa-times"></i> Erro`;
        } else {
            btn.style.backgroundColor = '';
            btn.innerHTML = text;
        }
    };

    // --- LÓGICA DO LOGIN ---
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        const password = e.target.querySelector('input[type="password"]').value;
        const btn = e.target.querySelector('button');
        const originalText = btn.innerHTML;

        setBtnState(btn, 'loading');

        // Simula delay de rede
        await new Promise(r => setTimeout(r, 1500));

        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            setBtnState(btn, 'success');
            setTimeout(() => alert(`Bem-vindo, ${user.name}!`), 500);
        } else {
            setBtnState(btn, 'error');
            alert("E-mail ou senha incorretos.");
            setTimeout(() => setBtnState(btn, 'reset', originalText), 2000);
        }
    });

    // --- LÓGICA DO CADASTRO ---
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const inputs = e.target.querySelectorAll('input');
        const btn = e.target.querySelector('button');
        const originalText = btn.innerHTML;

        const newUser = {
            name: inputs[0].value,
            email: inputs[1].value,
            password: inputs[2].value
        };

        setBtnState(btn, 'loading');
        await new Promise(r => setTimeout(r, 1500));

        const users = getUsers();
        if (users.some(u => u.email === newUser.email)) {
            setBtnState(btn, 'error');
            alert("Este e-mail já está cadastrado.");
            setTimeout(() => setBtnState(btn, 'reset', originalText), 2000);
        } else {
            saveUser(newUser);
            setBtnState(btn, 'success');
            setTimeout(() => {
                showScreen('login');
                setBtnState(btn, 'reset', originalText);
                e.target.reset();
            }, 1500);
        }
    });

    // --- LÓGICA DO ESQUECI A SENHA ---
    document.getElementById('forgot-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input').value;
        const btn = e.target.querySelector('button');
        const originalText = btn.innerHTML;

        setBtnState(btn, 'loading');
        await new Promise(r => setTimeout(r, 1500));

        const users = getUsers();
        const user = users.find(u => u.email === email);

        if (user) {
            setBtnState(btn, 'success');
            // Num sistema real, enviaria um token por e-mail.
            // Aqui vamos simular o sucesso.
            alert(`Link de recuperação enviado para: ${email}`);
            setTimeout(() => {
                showScreen('login');
                setBtnState(btn, 'reset', originalText);
                e.target.reset();
            }, 1500);
        } else {
            setBtnState(btn, 'error');
            alert("E-mail não encontrado em nossa base de dados.");
            setTimeout(() => setBtnState(btn, 'reset', originalText), 2000);
        }
    });
});