document.addEventListener("DOMContentLoaded", () => {
    const screens = {
        splash: document.getElementById('splash-screen'),
        login: document.getElementById('login-screen'),
        register: document.getElementById('register-screen'),
        forgot: document.getElementById('forgot-screen'),
        dashboard: document.getElementById('dashboard-screen')
    };

    const startBtn = document.getElementById('start-btn');
    const goRegister = document.getElementById('go-register');
    const goForgot = document.getElementById('go-forgot');
    const goLoginBtns = document.querySelectorAll('.go-login');
    const logoutBtn = document.getElementById('logout-btn');

    const getUsers = () => JSON.parse(localStorage.getItem('st_users')) || [
        { name: 'Admin User', email: 'admin@teste.com', password: '123456' }
    ];

    // --- FUNCIONALIDADE DOS BOTÕES DE DETALHES ---
    const detailsButtons = document.querySelectorAll('.btn-sm');

    detailsButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Pega o card pai do botão clicado
            const card = e.target.closest('.travel-card-site');
            const destino = card.querySelector('h4').innerText;
            const preco = card.querySelector('.tag').innerText;

            // Exemplo de ação: um alerta simples (ou você pode abrir um modal)
            alert(`Você selecionou: ${destino}\nPreço: ${preco}\nRedirecionando para detalhes...`);

            // Se quiser navegar para uma tela de detalhes específica:
            // window.location.href = 'detalhes.html'; 
        });
    });

    const saveUser = (user) => {
        const users = getUsers();
        users.push(user);
        localStorage.setItem('st_users', JSON.stringify(users));
    };

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
    logoutBtn.addEventListener('click', () => showScreen('login'));

    // Lógica Ver Senha
    document.querySelectorAll('.toggle-password').forEach(eye => {
        eye.addEventListener('click', function () {
            const input = document.getElementById(this.getAttribute('data-target'));
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });

    const setBtnState = (btn, state, text) => {
        btn.disabled = (state === 'loading');
        if (state === 'loading') {
            btn.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i>`;
        } else if (state === 'success') {
            btn.style.backgroundColor = 'var(--success)';
            btn.innerHTML = `<i class="fas fa-check"></i>`;
        } else if (state === 'error') {
            btn.style.backgroundColor = 'var(--error)';
            btn.innerHTML = `<i class="fas fa-times"></i>`;
        } else {
            btn.style.backgroundColor = '';
            btn.innerHTML = text;
        }
    };

    // LOGIN
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        const password = e.target.querySelector('input[type="password"]').value;
        const btn = e.target.querySelector('button');
        const originalText = btn.innerHTML;

        setBtnState(btn, 'loading');
        await new Promise(r => setTimeout(r, 1500));

        const user = getUsers().find(u => u.email === email && u.password === password);
        if (user) {
            setBtnState(btn, 'success');
            setTimeout(() => {
                document.getElementById('welcome-user').innerText = `Olá, ${user.name.split(' ')[0]}!`;
                showScreen('dashboard');
                setBtnState(btn, 'reset', originalText);
                e.target.reset();
            }, 1000);
        } else {
            setBtnState(btn, 'error');
            setTimeout(() => setBtnState(btn, 'reset', originalText), 2000);
        }
    });

    // CADASTRO
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const inputs = e.target.querySelectorAll('input');
        const btn = e.target.querySelector('button');
        const originalText = btn.innerHTML;
        const newUser = { name: inputs[0].value, email: inputs[1].value, password: inputs[2].value };

        setBtnState(btn, 'loading');
        await new Promise(r => setTimeout(r, 1200));

        if (getUsers().some(u => u.email === newUser.email)) {
            setBtnState(btn, 'error');
            setTimeout(() => setBtnState(btn, 'reset', originalText), 2000);
        } else {
            saveUser(newUser);
            setBtnState(btn, 'success');
            setTimeout(() => { showScreen('login'); setBtnState(btn, 'reset', originalText); e.target.reset(); }, 1500);
        }
    });

    // ESQUECI A SENHA
    const forgotForm = document.getElementById('forgot-form');
    const step1 = document.getElementById('forgot-step-1');
    const step2 = document.getElementById('forgot-step-2');
    const btnSave = document.getElementById('btn-save-pass');
    let userEmailReset = "";

    forgotForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('forgot-email').value;
        const btn = e.target.querySelector('button');
        const originalText = btn.innerHTML;
        setBtnState(btn, 'loading');
        await new Promise(r => setTimeout(r, 1000));

        if (getUsers().find(u => u.email === email)) {
            userEmailReset = email;
            setBtnState(btn, 'success');
            setTimeout(() => {
                step1.classList.add('hidden');
                step2.classList.remove('hidden');
                document.getElementById('forgot-msg').innerText = "Defina sua nova senha.";
            }, 800);
        } else {
            setBtnState(btn, 'error');
            setTimeout(() => setBtnState(btn, 'reset', originalText), 2000);
        }
    });

    btnSave.addEventListener('click', async () => {
        const newPass = document.getElementById('new-password').value;
        if (newPass.length < 4) return alert("Senha curta!");
        setBtnState(btnSave, 'loading');
        await new Promise(r => setTimeout(r, 1000));
        const users = getUsers();
        const idx = users.findIndex(u => u.email === userEmailReset);
        users[idx].password = newPass;
        localStorage.setItem('st_users', JSON.stringify(users));
        setBtnState(btnSave, 'success');
        setTimeout(() => {
            showScreen('login');
            step2.classList.add('hidden');
            step1.classList.remove('hidden');
            forgotForm.reset();
            setBtnState(btnSave, 'reset', "Salvar Nova Senha");
        }, 1500);
    });

    // FUNCIONALIDADE EXTRA: Pesquisa de Destinos
    const searchInput = document.querySelector('.search-box-site input');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.travel-card-site');

            cards.forEach(card => {
                const title = card.querySelector('h4').innerText.toLowerCase();
                const desc = card.querySelector('p').innerText.toLowerCase();

                if (title.includes(term) || desc.includes(term)) {
                    card.style.display = "block";
                    card.classList.add('fade-in');
                } else {
                    card.style.display = "none";
                }
            });
        });
    }

    // Feedback visual nos filtros (badges)
    const badges = document.querySelectorAll('.destinations-section .badge');
    badges.forEach(badge => {
        badge.addEventListener('click', function () {
            badges.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            // Aqui você poderia adicionar uma lógica de filtro por continente
        });
    });

    // --- FUNCIONALIDADE DE PESQUISA NO DASHBOARD ---
    const search_Input = document.querySelector('.search-box-site input');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.travel-card-site');

            cards.forEach(card => {
                const title = card.querySelector('h4').innerText.toLowerCase();
                const description = card.querySelector('p').innerText.toLowerCase();

                // Se o termo estiver no título ou na descrição, mostra o card
                if (title.includes(term) || description.includes(term)) {
                    card.style.display = "block";
                    card.style.animation = "fadeIn 0.4s ease forwards";
                } else {
                    card.style.display = "none";
                }
            });
        });
    }

    // --- FEEDBACK NOS FILTROS (BADGES) ---
    const filterBadges = document.querySelectorAll('.destinations-section .badge');
    filterBadges.forEach(badge => {
        badge.addEventListener('click', function () {
            filterBadges.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            // Aqui você poderia implementar filtros por categoria no futuro
        });
    });
});