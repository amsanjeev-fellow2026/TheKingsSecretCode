/* ============================================
   THE KING'S SECRET CODE - GAME LOGIC
   Disney/Pixar Fantasy Theme
   ============================================ */

// ===== GAME CONSTANTS =====
const CONSTANTS = {
    // Game Settings
    INITIAL_POSITION: 0,
    POSITION_MULTIPLIER: 25, // Pixels per position unit
    
    // Reachable targets (avoid 4, 9, 14, 19, 24, 29, 34)
    REACHABLE_TARGETS: [
        1, 2, 3,
        5, 6, 7, 8,
        10, 11, 12, 13,
        15, 16, 17, 18,
        20, 21, 22, 23,
        25, 26, 27, 28,
        30, 31, 32, 33,
        35, 36, 37, 38
    ],
    
    // Stone Values
    STONE_A_VALUE: 1,
    STONE_B_VALUE: 5,
    STONE_C_VALUE: 10,
    
    // Stone Max Uses
    STONE_A_MAX_USES: 3,
    STONE_B_MAX_USES: 1,
    STONE_C_MAX_USES: 3,
    
    // Stone Symbols (revealed only at end of round)
    STONE_A_SYMBOL: 'I',
    STONE_B_SYMBOL: 'V',
    STONE_C_SYMBOL: 'X',
    
    // Animation Durations (ms)
    EXPLORER_MOVE_DURATION: 800,
    SYMBOL_REVEAL_DELAY: 2000,
    
    // Particle Settings
    PARTICLE_COUNT: 50,
    CONFETTI_COUNT: 100,
    FIREWORK_COUNT: 20,
    
    // Audio Settings
    VOLUME_DEFAULT: 0.5,
    VOLUME_MUTED: 0
};

// ===== GAME STATE =====
class GameState {
    constructor() {
        this.targetNumber = 0;
        this.previousTargetNumber = null;
        this.currentPosition = CONSTANTS.INITIAL_POSITION;
        this.stoneRevealed = {
            a: false,
            b: false,
            c: false
        };
        this.stoneUses = {
            a: 0,
            b: 0,
            c: 0
        };
        this.isMuted = false;
        this.volume = CONSTANTS.VOLUME_DEFAULT;
        this.isGameActive = false;
        this.isAnimating = false;
    }
}

// ===== AUDIO MANAGER =====
class AudioManager {
    constructor() {
        this.backgroundMusic = null;
        this.sounds = {};
        this.isMuted = false;
        this.volume = CONSTANTS.VOLUME_DEFAULT;
        
        // Initialize audio elements
        this.initializeAudio();
    }
    
    /**
     * Initialize audio elements for background music and sound effects
     */
    initializeAudio() {
        try {
            // Background music
            this.backgroundMusic = new Audio('assets/audio/background.mp3');
            this.backgroundMusic.loop = true;
            this.backgroundMusic.volume = this.volume;
            
            // Sound effects
            this.sounds = {
                click: new Audio('assets/audio/click.mp3'),
                magic: new Audio('assets/audio/magic.mp3'),
                jump: new Audio('assets/audio/jump.mp3'),
                victory: new Audio('assets/audio/victory.mp3'),
                stone: new Audio('assets/audio/stone.mp3')
            };
            
            // Set volume for all sounds
            Object.values(this.sounds).forEach(sound => {
                sound.volume = this.volume;
            });
        } catch (error) {
            console.log('Audio initialization failed, continuing silently:', error);
            this.backgroundMusic = null;
            this.sounds = {};
        }
    }
    
    /**
     * Play background music
     */
    playBackgroundMusic() {
        if (!this.isMuted && this.backgroundMusic) {
            this.backgroundMusic.play().catch(error => {
                console.log('Audio play failed:', error);
            });
        }
    }
    
    /**
     * Stop background music
     */
    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }
    }
    
    /**
     * Play a specific sound effect
     * @param {string} soundName - Name of the sound to play
     */
    playSound(soundName) {
        if (!this.isMuted && this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play().catch(error => {
                console.log('Sound play failed:', error);
            });
        }
    }
    
    /**
     * Toggle mute state
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        const newVolume = this.isMuted ? CONSTANTS.VOLUME_MUTED : this.volume;
        
        // Update background music volume
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = newVolume;
        }
        
        // Update all sound volumes
        Object.values(this.sounds).forEach(sound => {
            sound.volume = newVolume;
        });
        
        return this.isMuted;
    }
    
    /**
     * Set volume level
     * @param {number} volume - Volume level (0 to 1)
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        
        if (!this.isMuted) {
            if (this.backgroundMusic) {
                this.backgroundMusic.volume = this.volume;
            }
            
            Object.values(this.sounds).forEach(sound => {
                sound.volume = this.volume;
            });
        }
    }
}

// ===== PARTICLE SYSTEM =====
class ParticleSystem {
    constructor(container) {
        this.container = container;
        this.particles = [];
    }
    
    /**
     * Create floating particles in the background
     */
    createFloatingParticles() {
        for (let i = 0; i < CONSTANTS.PARTICLE_COUNT; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 8}s`;
            particle.style.animationDuration = `${6 + Math.random() * 4}s`;
            
            // Random colors
            const colors = ['#ffd700', '#00ffff', '#ff6b6b', '#6bcb77', '#4d96ff'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            this.container.appendChild(particle);
            this.particles.push(particle);
        }
    }
    
    /**
     * Create dust particles at a specific position
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    createDustParticles(x, y) {
        const dustContainer = document.getElementById('dust-container');
        if (!dustContainer) return;
        
        for (let i = 0; i < 8; i++) {
            const dust = document.createElement('div');
            dust.className = 'dust-particle';
            dust.style.left = `${x + (Math.random() - 0.5) * 40}px`;
            dust.style.top = `${y}px`;
            dust.style.animationDelay = `${Math.random() * 0.2}s`;
            
            dustContainer.appendChild(dust);
            
            // Remove after animation
            setTimeout(() => {
                dust.remove();
            }, 1000);
        }
    }
    
    /**
     * Create confetti for win celebration
     */
    createConfetti() {
        const confettiContainer = document.getElementById('confetti-container');
        if (!confettiContainer) return;
        
        const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6b35', '#9b59b6'];
        
        for (let i = 0; i < CONSTANTS.CONFETTI_COUNT; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = `${Math.random() * 2}s`;
            confetti.style.animationDuration = `${2 + Math.random() * 2}s`;
            
            // Random shapes
            const shapes = ['circle', 'square'];
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            if (shape === 'circle') {
                confetti.style.borderRadius = '50%';
            }
            
            confettiContainer.appendChild(confetti);
            
            // Remove after animation
            setTimeout(() => {
                confetti.remove();
            }, 4000);
        }
    }
    
    /**
     * Create fireworks for win celebration
     */
    createFireworks() {
        const fireworksContainer = document.getElementById('fireworks-container');
        if (!fireworksContainer) return;
        
        const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6b35', '#9b59b6'];
        
        for (let i = 0; i < CONSTANTS.FIREWORK_COUNT; i++) {
            setTimeout(() => {
                const x = 20 + Math.random() * 60;
                const y = 20 + Math.random() * 40;
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                // Create explosion particles
                for (let j = 0; j < 12; j++) {
                    const firework = document.createElement('div');
                    firework.className = 'firework';
                    firework.style.left = `${x}%`;
                    firework.style.top = `${y}%`;
                    firework.style.background = color;
                    
                    const angle = (j / 12) * Math.PI * 2;
                    const distance = 50 + Math.random() * 30;
                    const endX = Math.cos(angle) * distance;
                    const endY = Math.sin(angle) * distance;
                    
                    firework.style.setProperty('--end-x', `${endX}px`);
                    firework.style.setProperty('--end-y', `${endY}px`);
                    firework.style.animation = `firework-explode 1.5s ease-out forwards`;
                    
                    fireworksContainer.appendChild(firework);
                    
                    setTimeout(() => {
                        firework.remove();
                    }, 1500);
                }
            }, i * 300);
        }
    }
    
    /**
     * Clear all particles
     */
    clearParticles() {
        this.particles.forEach(particle => particle.remove());
        this.particles = [];
    }
}

// ===== EXPLORER CONTROLLER =====
class ExplorerController {
    constructor() {
        this.explorer = document.getElementById('explorer');
        this.roadContainer = document.getElementById('road-container');
        this.currentPosition = CONSTANTS.INITIAL_POSITION;
    }
    
    /**
     * Move explorer to a new position
     * @param {number} newPosition - New position value
     * @param {Function} callback - Callback after animation completes
     */
    moveTo(newPosition, callback) {
        if (!this.explorer) return;
        
        const oldPosition = this.currentPosition;
        this.currentPosition = newPosition;
        
        // Calculate pixel position
        const pixelPosition = 50 + (newPosition * CONSTANTS.POSITION_MULTIPLIER);
        
        // Add walking animation class
        this.explorer.classList.add('walking');
        this.explorer.classList.remove('jumping');
        
        // Animate movement
        this.explorer.style.left = `${pixelPosition}px`;
        
        // Scroll road to follow explorer
        this.scrollWorld(pixelPosition);
        
        // Remove walking class after animation
        setTimeout(() => {
            this.explorer.classList.remove('walking');
            
            // Add jump animation
            this.explorer.classList.add('jumping');
            
            // Create dust particles
            const explorerRect = this.explorer.getBoundingClientRect();
            const roadRect = this.roadContainer.getBoundingClientRect();
            const dustX = pixelPosition;
            const dustY = 80;
            
            if (window.particleSystem) {
                window.particleSystem.createDustParticles(dustX, dustY);
            }
            
            // Remove jump class after animation
            setTimeout(() => {
                this.explorer.classList.remove('jumping');
                
                // Trigger screen shake
                this.screenShake();
                
                if (callback) callback();
            }, 600);
        }, CONSTANTS.EXPLORER_MOVE_DURATION);
    }
    
    /**
     * Scroll road to keep explorer in view
     * @param {number} explorerPosition - Explorer's pixel position
     */
    scrollWorld(explorerPosition) {

    if (!this.roadContainer) return;

    const containerWidth = this.roadContainer.offsetWidth;

    const explorerWidth = this.explorer.offsetWidth;

    let scrollPosition =
        explorerPosition
        - containerWidth / 2
        + explorerWidth / 2;

    const maxScroll =
        this.roadContainer.scrollWidth
        - containerWidth;

    scrollPosition =
        Math.max(0,
        Math.min(scrollPosition, maxScroll));

    this.roadContainer.scrollTo({

        left: scrollPosition,

        behavior: "smooth"

    });

}
    
    /**
     * Apply screen shake effect
     */
    screenShake() {
        const gameContainer = document.getElementById('game-container');
        if (!gameContainer) return;
        
        gameContainer.style.animation = 'screen-shake 0.3s ease-out';
        
        setTimeout(() => {
            gameContainer.style.animation = '';
        }, 300);
    }
    
    /**
     * Reset explorer to starting position
     */
    reset() {
        this.currentPosition = CONSTANTS.INITIAL_POSITION;
        if (this.explorer) {
            this.explorer.style.left = '50px';
        }
        if (this.roadContainer) {
            this.roadContainer.scrollTo({ left: 0, behavior: 'smooth' });
        }
    }
}

// ===== STONE CONTROLLER =====
class StoneController {
    constructor(gameState) {
        this.gameState = gameState;
        this.stones = {
            a: document.getElementById('stone-a'),
            b: document.getElementById('stone-b'),
            c: document.getElementById('stone-c')
        };
        this.symbols = {
            a: document.getElementById('stone-a-symbol'),
            b: document.getElementById('stone-b-symbol'),
            c: document.getElementById('stone-c-symbol')
        };
        
        this.initializeStoneListeners();
    }
    
    /**
     * Initialize click listeners for stones
     */
    initializeStoneListeners() {
        Object.keys(this.stones).forEach(key => {
            const stone = this.stones[key];
            if (stone) {
                stone.addEventListener('click', () => this.handleStoneClick(key));
                
                // Add keyboard support
                stone.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.handleStoneClick(key);
                    }
                });
            }
        });
    }
    
    /**
     * Handle stone click
     * @param {string} stoneKey - Key of the stone (a, b, or c)
     */
    handleStoneClick(stoneKey) {
        if (!window.gameController || window.gameController.isAnimating) return;
        
        // Check if stone has uses remaining
        const maxUses = this.getStoneMaxUses(stoneKey);
        const currentUses = this.gameState.stoneUses[stoneKey];
        
        if (currentUses >= maxUses) {
            return; // Stone is disabled
        }
        
        const value = this.getStoneValue(stoneKey);
        
        // Play stone sound
        if (window.audioManager) {
            window.audioManager.playSound('stone');
        }
        
        // Increment use count
        this.gameState.stoneUses[stoneKey]++;
        this.updateStoneUsesDisplay(stoneKey);
        
        // Disable stone if max uses reached
        if (this.gameState.stoneUses[stoneKey] >= maxUses) {
            this.disableStone(stoneKey);
        }
        
        // Move explorer - no symbol reveal during gameplay
        const newPosition = this.gameState.currentPosition + value;
        window.gameController.moveExplorer(newPosition);
    }
    
    /**
     * Get the max uses of a stone
     * @param {string} stoneKey - Key of the stone
     * @returns {number} Max uses
     */
    getStoneMaxUses(stoneKey) {
        switch (stoneKey) {
            case 'a':
                return CONSTANTS.STONE_A_MAX_USES;
            case 'b':
                return CONSTANTS.STONE_B_MAX_USES;
            case 'c':
                return CONSTANTS.STONE_C_MAX_USES;
            default:
                return 0;
        }
    }
    
    /**
     * Update stone uses display
     * @param {string} stoneKey - Key of the stone
     */
    updateStoneUsesDisplay(stoneKey) {
        const usesContainer = document.getElementById(`stone-${stoneKey}-uses`);
        if (!usesContainer) return;
        
        const stars = usesContainer.querySelectorAll('.use-star');
        const currentUses = this.gameState.stoneUses[stoneKey];
        
        stars.forEach((star, index) => {
            if (index < currentUses) {
                star.classList.add('used');
            } else {
                star.classList.remove('used');
            }
        });
    }
    
    /**
     * Disable a stone when max uses reached
     * @param {string} stoneKey - Key of the stone
     */
    disableStone(stoneKey) {
        const stone = this.stones[stoneKey];
        if (stone) {
            stone.classList.add('disabled');
            stone.disabled = true;
        }
    }
    
    /**
     * Get the movement value of a stone
     * @param {string} stoneKey - Key of the stone
     * @returns {number} Movement value
     */
    getStoneValue(stoneKey) {
        switch (stoneKey) {
            case 'a':
                return CONSTANTS.STONE_A_VALUE;
            case 'b':
                return CONSTANTS.STONE_B_VALUE;
            case 'c':
                return CONSTANTS.STONE_C_VALUE;
            default:
                return 0;
        }
    }
    
    
    /**
     * Reset all stones
     */
    reset() {
        // Stones remain mysterious - no reset needed
    }
    
    /**
     * Reset stone uses only (keep symbols revealed)
     */
    resetUses() {
        // Reset uses in state
        this.gameState.stoneUses = {
            a: 0,
            b: 0,
            c: 0
        };
        
        // Reset stone disabled states
        Object.keys(this.stones).forEach(key => {
            const stone = this.stones[key];
            if (stone) {
                stone.classList.remove('disabled');
                stone.disabled = false;
            }
            
            // Reset star display
            this.updateStoneUsesDisplay(key);
        });
    }
}

// ===== GAME CONTROLLER =====
class GameController {
    constructor() {
        this.state = new GameState();
        this.audioManager = new AudioManager();
        this.particleSystem = null;
        this.explorerController = null;
        this.stoneController = null;
        
        this.isAnimating = false;
        
        // Initialize
        this.initialize();
    }
    
    /**
     * Initialize the game
     */
    initialize() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    /**
     * Setup game components
     */
    setup() {
        // Initialize particle system
        const particlesContainer = document.getElementById('particles-container');
        if (particlesContainer) {
            this.particleSystem = new ParticleSystem(particlesContainer);
            this.particleSystem.createFloatingParticles();
            window.particleSystem = this.particleSystem;
        }
        
        // Initialize explorer controller
        this.explorerController = new ExplorerController();
        
        // Initialize stone controller
        this.stoneController = new StoneController(this.state);
        
        // Setup intro video
        this.setupIntroVideo();
        
        // Setup video mute button
        this.setupVideoMuteButton();
        
        // Setup skip intro button
        this.setupSkipIntroButton();
        
        // Setup mute button
        this.setupMuteButton();
        
        // Setup continue button
        this.setupContinueButton();
        
        // Setup retry button
        this.setupRetryButton();
        
        // Setup keyboard accessibility
        this.setupKeyboardAccessibility();
        
        // Make audio manager globally accessible
        window.audioManager = this.audioManager;
        window.gameController = this;
    }
    
    /**
     * Setup video mute button
     */
    setupVideoMuteButton() {
        const muteButton = document.getElementById('video-mute-button');
        const video = document.getElementById('intro-video');
        
        if (!muteButton || !video) return;
        
        muteButton.addEventListener('click', () => {
            video.muted = !video.muted;
            const icon = muteButton.querySelector('.mute-icon');
            if (icon) {
                icon.textContent = video.muted ? '🔇' : '🔊';
            }
        });
        
        // Try to unmute on first user interaction
        document.addEventListener('click', () => {
            if (video && video.muted) {
                video.muted = false;
                const icon = muteButton.querySelector('.mute-icon');
                if (icon) {
                    icon.textContent = '🔊';
                }
            }
        }, { once: true });
    }
    
    /**
     * Setup intro video handling
     */
    setupIntroVideo() {
        const video = document.getElementById('intro-video');
        const introContainer = document.getElementById('intro-container');
        const gameContainer = document.getElementById('game-container');
        
        if (!video) {
            // If no video, go directly to game
            this.transitionToGame();
            return;
        }
        
        // Handle video end - go directly to game
        video.addEventListener('ended', () => {
            this.transitionToGame();
        });
        
        // Handle video error - go directly to game
        video.addEventListener('error', () => {
            console.log('Intro video not found, starting game');
            this.transitionToGame();
        });
    }
    
    /**
     * Setup skip intro button
     */
    setupSkipIntroButton() {
        const skipButton = document.getElementById('skip-intro-button');
        if (!skipButton) return;
        
        skipButton.addEventListener('click', () => {
            const video = document.getElementById('intro-video');
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
            this.transitionToGame();
        });
        
        // Keyboard support
        skipButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                skipButton.click();
            }
        });
    }
    
    /**
     * Transition from intro to game
     */
    transitionToGame() {
        const introContainer = document.getElementById('intro-container');
        const gameContainer = document.getElementById('game-container');
        
        if (introContainer) {
            introContainer.style.opacity = '0';
            setTimeout(() => {
                introContainer.classList.add('hidden');
            }, 800);
        }
        
        if (gameContainer) {
            gameContainer.classList.remove('hidden');
            setTimeout(() => {
                gameContainer.classList.add('visible');
                // Start background music
                this.audioManager.playBackgroundMusic();
                // Start new round
                this.startNewRound();
            }, 100);
        }
    }
    
    
    /**
     * Setup mute button
     */
    setupMuteButton() {
        const muteButton = document.getElementById('mute-button');
        if (!muteButton) return;
        
        muteButton.addEventListener('click', () => {
            const isMuted = this.audioManager.toggleMute();
            muteButton.querySelector('.mute-icon').textContent = isMuted ? '🔇' : '🔊';
        });
        
        // Keyboard support
        muteButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                muteButton.click();
            }
        });
    }
    
    /**
     * Setup retry button for overshoot prompt
     */
    setupRetryButton() {
        const retryButton = document.getElementById('retry-button');
        if (!retryButton) return;
        
        retryButton.addEventListener('click', () => {
            // Play click sound
            this.audioManager.playSound('click');
            
            // Hide retry overlay
            this.hideRetryOverlay();
            
            // Reset to start of current round
            this.resetCurrentRound();
        });
        
        // Keyboard support
        retryButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                retryButton.click();
            }
        });
    }
    
    /**
     * Show retry prompt when overshooting target
     */
    showRetryPrompt() {
        this.state.isGameActive = false;
        
        // Play error sound if available
        this.audioManager.playSound('stone');
        
        // Shake camera slightly
        this.explorerController.screenShake(); 

        // Show retry overlay
        const retryOverlay = document.getElementById('retry-overlay');
        if (retryOverlay) {
            retryOverlay.classList.remove('hidden');
            setTimeout(() => {
                retryOverlay.classList.add('visible');
            }, 100);
        }

        Object.values(this.stoneController.stones).forEach(stone => {
    stone.disabled = true;
});
    }
    
    /**
     * Hide retry overlay
     */
    hideRetryOverlay() {
        const retryOverlay = document.getElementById('retry-overlay');
        if (retryOverlay) {
            retryOverlay.classList.remove('visible');
            setTimeout(() => {
                retryOverlay.classList.add('hidden');
            }, 800);
        }
    }
    
    /**
     * Reset current round (keep same target, reset position and stone uses)
     */
    resetCurrentRound() {
        // Reset position
        this.state.currentPosition = CONSTANTS.INITIAL_POSITION;
        this.isAnimating = false;
        this.state.isGameActive = true;
        
        // Reset stone uses (keep target same)
        this.state.stoneUses = {
            a: 0,
            b: 0,
            c: 0
        };
        
        // Update UI
        this.updateUI();
        
        // Reset explorer
        this.explorerController.reset();
        
        // Reset stones (uses only, keep symbols)
        this.stoneController.resetUses();
    }
    
    /**
     * Setup continue button for win screen
     */
    setupContinueButton() {
        const continueButton = document.getElementById('continue-button');
        if (!continueButton) return;
        
        continueButton.addEventListener('click', () => {
            // Play click sound
            this.audioManager.playSound('click');
            
            // Hide win overlay
            this.hideWinOverlay();
            
            // Start new round
            this.startNewRound();
        });
        
        // Keyboard support
        continueButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                continueButton.click();
            }
        });
    }
    
    /**
     * Setup keyboard accessibility
     */
    setupKeyboardAccessibility() {
        // Add keyboard shortcuts for stones
        document.addEventListener('keydown', (e) => {
            if (!this.state.isGameActive || this.isAnimating) return;
            
            switch (e.key) {
                case '1':
                    this.stoneController.handleStoneClick('a');
                    break;
                case '2':
                    this.stoneController.handleStoneClick('b');
                    break;
                case '3':
                    this.stoneController.handleStoneClick('c');
                    break;
            }
        });
    }
    
    /**
     * Start a new game round
     */
    startNewRound() {
        // Reset state
        this.state.currentPosition = CONSTANTS.INITIAL_POSITION;
        this.isAnimating = false;
        this.state.isGameActive = true;
        
        // Reset stone uses (but keep symbols revealed)
        this.state.stoneUses = {
            a: 0,
            b: 0,
            c: 0
        };
        
        // Generate random target from reachable array
        this.generateTarget();
        
        // Update UI
        this.updateUI();
        
        // Reset explorer
        this.explorerController.reset();
        
        // Reset stones (uses only, keep symbols)
        this.stoneController.resetUses();
    }
    
    /**
     * Generate a random target from reachable targets array
     * Avoids consecutive repeats
     */
    generateTarget() {
        const availableTargets = CONSTANTS.REACHABLE_TARGETS.filter(
            target => target !== this.state.previousTargetNumber
        );
        
        const randomIndex = Math.floor(Math.random() * availableTargets.length);
        this.state.previousTargetNumber = this.state.targetNumber;
        this.state.targetNumber = availableTargets[randomIndex];
    }
    
    /**
     * Update UI elements
     */
    updateUI() {
        const targetNumberEl = document.getElementById('target-number');
        const currentPositionEl = document.getElementById('current-position');
        
        if (targetNumberEl) {
            targetNumberEl.textContent = this.state.targetNumber;
        }
        
        if (currentPositionEl) {
            currentPositionEl.textContent = this.state.currentPosition;
        }
    }
    
    /**
     * Move explorer to new position
     * @param {number} newPosition - New position value
     */
    moveExplorer(newPosition) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        
        // Play jump sound
        this.audioManager.playSound('jump');
        
        // Move explorer
        this.explorerController.moveTo(newPosition, () => {
            // Update state
            this.state.currentPosition = newPosition;
            
            // Update UI
            this.updateUI();

            this.isAnimating = false;

            this.checkWinCondition();

            console.log(
    "Current:", this.state.currentPosition,
    "Target:", this.state.targetNumber
);
        });
    }
    
    
    /**
     * Check if player has reached the target
     */
checkWinCondition() {

    console.log(
        "Current:",
        this.state.currentPosition,
        "Target:",
        this.state.targetNumber
    );

    if (this.state.currentPosition === this.state.targetNumber) {

        console.log("WIN");

        this.showWinCelebration();

    }
    else if (this.state.currentPosition > this.state.targetNumber) {

        console.log("RETRY");

        this.showRetryPrompt();

    }

}
    
    /**
     * Show win celebration with cinematic symbol reveal
     */
    showWinCelebration() {
        this.state.isGameActive = false;
        
        // Play victory sound
// Stop the background music
this.audioManager.stopBackgroundMusic();

// Play victory fanfare
this.audioManager.playSound('victory');        
        // Show win overlay
        const winOverlay = document.getElementById('win-overlay');
        if (winOverlay) {
            winOverlay.classList.remove('hidden');
            setTimeout(() => {
                winOverlay.classList.add('visible');
            }, 100);
        }
        
        // Create confetti and fireworks
        if (this.particleSystem) {
            this.particleSystem.createConfetti();
            this.particleSystem.createFireworks();
        }
        
        // Open castle gate
        this.openCastleGate();
        
        // Cinematic symbol reveal sequence
        setTimeout(() => {
            this.revealSymbols();
        }, CONSTANTS.SYMBOL_REVEAL_DELAY);
    }
    
    /**
     * Reveal symbols in cinematic sequence
     */
    revealSymbols() {
        const symbolContainer = document.querySelector('.symbol-reveal-container');
        if (symbolContainer) {
            symbolContainer.classList.add('visible');
        }
        
        // Show continue button after reveal
        setTimeout(() => {
            const continueButton = document.getElementById('continue-button');
            if (continueButton) {
                continueButton.classList.remove('hidden');
            }
        }, 3000);
    }
    
    /**
     * Open castle gate animation
     */
    openCastleGate() {
        const gateDoor = document.querySelector('.gate-door');
        if (gateDoor) {
            gateDoor.style.transform = 'translateX(-50%) scaleY(0)';
        }
    }
    
    /**
     * Hide win overlay
     */
    hideWinOverlay() {
        const winOverlay = document.getElementById('win-overlay');
        if (winOverlay) {
            winOverlay.classList.remove('visible');
            setTimeout(() => {
                winOverlay.classList.add('hidden');
            }, 800);
        }
        
        // Close castle gate
        const gateDoor = document.querySelector('.gate-door');
        if (gateDoor) {
            gateDoor.style.transform = 'translateX(-50%) scaleY(1)';
        }
    }
}

// ===== ADDITIONAL CSS ANIMATIONS =====
const additionalStyles = `
@keyframes screen-shake {
    0%, 100% {
        transform: translateX(0);
    }
    25% {
        transform: translateX(-5px);
    }
    75% {
        transform: translateX(5px);
    }
}
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// ===== INITIALIZE GAME =====
// Create game instance when page loads
let game;

window.addEventListener('load', () => {
    game = new GameController();
});

// ===== EXPORT FOR DEBUGGING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameController, GameState, AudioManager, ParticleSystem };
}

