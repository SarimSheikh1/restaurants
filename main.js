document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Welcome Overlay & Geolocation Mock ---
    const welcomeOverlay = document.getElementById('welcome-overlay');
    const searchStatus = document.getElementById('search-location');
    const startBtn = document.getElementById('start-journey-btn');
    const navbar = document.getElementById('navbar');

    setTimeout(() => {
        searchStatus.innerHTML = '<span class="text-white">Nearest Branch:</span> <span class="text-gold-400 font-bold">Downtown Flagship (0.8 mi)</span>';
        startBtn.classList.remove('hidden');
    }, 2000);

    startBtn.addEventListener('click', () => {
        welcomeOverlay.style.opacity = '0';
        welcomeOverlay.style.pointerEvents = 'none';
        navbar.classList.remove('opacity-0', '-translate-y-full');
        document.body.style.overflowY = 'auto'; // allow scroll
    });


    // --- 2. 3D Map Logic ---
    const mapPinsContainer = document.getElementById('map-pins-container');
    const branchPanel = document.getElementById('branch-panel');
    const branchName = document.getElementById('branch-name');
    const branchDesc = document.getElementById('branch-desc');
    const branchImg = document.getElementById('branch-img');

    // Data
    const branches = [
        { id: 1, name: "Downtown Flagship", type: "fine", top: "40%", left: "50%", desc: "The original fine dining experience with live jazz.", color: "border-gold-400 bg-gold-400", img: "assets/hero.png" },
        { id: 2, name: "Harbor Bistro", type: "bistro", top: "60%", left: "30%", desc: "Casual dining by the water.", color: "border-crimson bg-crimson", img: "assets/scallops.png" },
        { id: 3, name: "Skyline Rooftop", type: "view", top: "25%", left: "70%", desc: "Breathtaking city views.", color: "border-blue-400 bg-blue-400", img: "assets/steak_deal.png" },
        { id: 4, name: "Garden Terrace", type: "fine", top: "70%", left: "65%", desc: "Outdoor culinary oasis.", color: "border-gold-400 bg-gold-400", img: "assets/risotto.png" },
    ];

    function renderPins(filter) {
        mapPinsContainer.innerHTML = '';
        branches.forEach((b, index) => {
            if (filter !== 'all' && b.type !== filter) return;

            const pin = document.createElement('div');
            pin.className = `absolute w-8 h-8 rounded-full border-2 cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center animate-pin-drop map-pin ${b.color}`;
            pin.style.top = b.top;
            pin.style.left = b.left;
            pin.style.animationDelay = `${index * 0.2}s`;

            // Inner dot
            pin.innerHTML = `<div class="w-2 h-2 bg-white rounded-full"></div>`;

            pin.addEventListener('click', (e) => {
                // Show Details
                branchName.innerText = b.name;
                branchDesc.innerText = b.desc;
                branchImg.src = b.img;
                branchPanel.classList.remove('opacity-0', 'pointer-events-none', 'scale-90');

                // Pulse Animation to Pin
                document.querySelectorAll('.map-pin').forEach(p => p.classList.remove('animate-branch-pulse'));
                pin.classList.add('animate-branch-pulse');
            });

            mapPinsContainer.appendChild(pin);
        });
    }

    renderPins('all');

    // Filters
    document.querySelectorAll('.map-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.map-filter').forEach(b => b.classList.remove('border-gold-400', 'text-gold-400'));
            btn.classList.add('border-gold-400', 'text-gold-400');
            renderPins(btn.dataset.filter);
        });
    });

    window.closeBranchPanel = () => {
        branchPanel.classList.add('opacity-0', 'pointer-events-none', 'scale-90');
    };


    // --- 3. "Chef vs Foodie" Tic-Tac-Toe ---
    const board = document.getElementById('game-board');
    const gameTurn = document.getElementById('game-turn');
    const gameResult = document.getElementById('game-result');
    const winnerLine = document.getElementById('winner-line');
    let cells = Array(9).fill(null);
    let currentPlayer = 'O'; // O is Foodie (User), X is Chef (AI)
    let gameActive = true;

    function initGame() {
        board.innerHTML = '';
        cells = Array(9).fill(null);
        gameActive = true;
        winnerLine.classList.add('hidden');
        gameResult.classList.add('hidden');
        cells.forEach((_, i) => {
            const cell = document.createElement('div');
            cell.className = 'bg-white/10 rounded cursor-pointer flex items-center justify-center text-4xl font-display font-bold hover:bg-white/20 transition-colors h-20';
            cell.addEventListener('click', () => handleCellClick(i, cell));
            board.appendChild(cell);
        });
    }

    function handleCellClick(i, cell) {
        if (!gameActive || cells[i]) return;

        // User Move (O)
        cells[i] = 'O';
        cell.innerHTML = '<span class="text-crimson">O</span>';
        cell.classList.add('pointer-events-none');

        if (checkWin('O')) { endGame('O'); return; }
        if (!cells.includes(null)) { endGame('draw'); return; }

        // AI Move (X) with delay
        gameTurn.innerHTML = '<span class="text-gold-400">Chef</span> (AI) Thinking...';
        setTimeout(() => {
            if (!gameActive) return;
            const aiMove = getBestMove();
            cells[aiMove] = 'X';
            board.children[aiMove].innerHTML = '<span class="text-gold-400">X</span>';
            board.children[aiMove].classList.add('pointer-events-none');

            if (checkWin('X')) { endGame('X'); }
            else if (!cells.includes(null)) { endGame('draw'); }
            else {
                gameTurn.innerHTML = '<span class="text-crimson">You</span> (Foodie)';
            }
        }, 600);
    }

    function getBestMove() {
        // Simple AI: Find empty spot
        const empty = cells.map((v, i) => v === null ? i : null).filter(v => v !== null);
        return empty[Math.floor(Math.random() * empty.length)];
    }

    function checkWin(player) {
        const wins = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
        return wins.some(combo => {
            if (combo.every(i => cells[i] === player)) {
                drawWinLine(combo);
                return true;
            }
            return false;
        });
    }

    function drawWinLine(combo) {
        // Simple SVG line logic (simplified coordinates for demo)
        winnerLine.classList.remove('hidden');
    }

    function endGame(winner) {
        gameActive = false;
        if (winner === 'O') {
            gameResult.innerHTML = '<h4 class="font-bold text-gold-400 text-lg">You Win!</h4><p class="text-xs text-gray-300">Code: LUMINA10</p>';
            gameResult.classList.remove('hidden');
            // Confetti
            // (Reuse confetti function if available or make new one)
        } else if (winner === 'X') {
            gameTurn.innerText = "Chef Wins!";
        } else {
            gameTurn.innerText = "Draw!";
        }
    }

    document.getElementById('reset-game').addEventListener('click', initGame);
    initGame();


    // --- 4. Smart Reservation ---
    const resModal = document.getElementById('reservation-modal');
    window.openReservation = () => {
        branchPanel.classList.add('opacity-0', 'pointer-events-none'); // close branch details
        resModal.classList.remove('opacity-0', 'pointer-events-none');
    };
    window.closeReservation = () => {
        resModal.classList.add('opacity-0', 'pointer-events-none');
    };

    document.querySelectorAll('.table-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.table-btn').forEach(b => b.classList.remove('bg-gold-500', 'scale-110'));
            btn.classList.add('bg-gold-500', 'scale-110');
            document.getElementById('selected-table-id').innerText = btn.dataset.id;
        });
    });

    window.confirmReservation = () => {
        alert("Table Reserved! (Demo)");
        closeReservation();
    };


    // --- 5. Vision 2030 Interactions ---

    // Flavor EQ Logic
    const orb = document.getElementById('flavor-orb');
    const sliders = document.querySelectorAll('.flavor-slider');

    sliders.forEach(slider => {
        slider.addEventListener('input', () => {
            const r = sliders[0].value * 2.5;
            const b = sliders[1].value * 2.5;
            orb.style.background = `rgb(${r}, 50, ${b})`;
            orb.style.boxShadow = `0 0 30px rgb(${r}, 50, ${b}, 0.6)`;
        });
    });

    // Martian Seed Reveal
    const seed = document.getElementById('martian-seed');
    const seedLife = document.getElementById('seed-life');
    const beam = document.getElementById('hologram-beam');
    let seedCracked = false;

    if (seed) {
        seed.addEventListener('click', () => {
            if (seedCracked) return;
            seedCracked = true;

            // 1. Crack Animation
            seed.classList.add('animate-ping'); // momentary shock

            setTimeout(() => {
                seed.classList.remove('animate-ping');
                // 2. Reveal Life
                seedLife.classList.remove('opacity-0', 'scale-0');
                seedLife.classList.add('opacity-100', 'scale-100');

                // 3. Beam Up
                setTimeout(() => {
                    beam.classList.remove('opacity-0', 'translate-y-full');
                    showToast("PROJECT TERRAFORM UNLOCKED");
                }, 500);
            }, 300);
        });
    }

});
