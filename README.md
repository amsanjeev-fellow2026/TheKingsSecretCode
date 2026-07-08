# The King's Secret Code

An educational HTML5 game for Grade 5 mathematics students (Teach For India).

## Overview

This is an inquiry-based learning experience designed to spark curiosity about symbols representing numbers. The game does NOT teach Roman numerals directly - it creates a discovery experience where students naturally uncover that symbols can represent quantities.

**Important:** This game is a curiosity spark. The teacher provides the actual lesson about Roman numerals after students play.

## Learning Objectives

After playing, students should discover:
- There are three mysterious symbols
- Each symbol behaves differently
- Symbols can represent quantities

## Game Features

- **Disney/Pixar-inspired fantasy theme** with beautiful animations
- **Inquiry-based discovery** - no direct teaching
- **Magical stones** that remain mysterious during gameplay
- **Cute Disney-style explorer character** with animations
- **Monument Valley-style curved stone path** road
- **Cinematic symbol reveal** at end of each round
- **Enhanced castle** with torch flames and light effects
- **Ambient animations** - clouds, birds, butterflies, leaves, particles, parallax backgrounds
- **Sound system** with background music and sound effects (graceful fallback if missing)
- **Fully responsive** - works on laptops, desktops, projectors, and large screens
- **Accessibility features** - keyboard support, high contrast mode, screen reader friendly

## Project Structure

```
Romans2/
├── index.html          # Main game HTML
├── style.css           # All styling and animations
├── game.js             # Complete game logic
├── assets/
│   ├── intro.mp4       # Intro video (autoplays on load)
│   └── audio/          # Audio files (optional)
│       ├── background.mp3  # Background fantasy music
│       ├── click.mp3       # Button click sound
│       ├── magic.mp3       # Magic/stone reveal sound
│       ├── jump.mp3        # Explorer jump sound
│       ├── stone.mp3       # Stone click sound
│       └── victory.mp3     # Win celebration sound
└── README.md           # This file
```

## How to Use

### Quick Start

1. Open `index.html` in a web browser
2. The intro video will autoplay (if video file exists)
3. Click "⏭ Skip Intro" to skip the video
4. Game starts automatically after video ends
5. Click the magical stones to move the explorer
6. Reach the target number to win and see the symbol reveal

### Asset Requirements

The game works without assets, but for the full experience, add these files:

#### Video (Optional)
- `assets/intro.mp4` - Intro video (recommended: 30-60 seconds, fantasy theme)
  - If missing, game starts directly

#### Audio (Optional)
- `assets/audio/background.mp3` - Background fantasy music (loopable)
- `assets/audio/click.mp3` - Button click sound effect
- `assets/audio/magic.mp3` - Magic/stone reveal sound effect
- `assets/audio/jump.mp3` - Explorer jump sound effect
- `assets/audio/stone.mp3` - Stone click sound effect
- `assets/audio/victory.mp3` - Win celebration sound effect

**Note:** If audio files are missing, the game will still work (sounds simply won't play).

#### Images (Optional)
All visual elements are created with CSS. Custom images are not required but can be added if desired.

## Game Mechanics

### Intro Flow

1. Video autoplays (if `assets/intro.mp4` exists)
2. Skip button available in top-right corner
3. When video ends or is skipped → game starts directly
4. No intermediate start screen

### The Stones

Three magical stones at the bottom of the screen:

- **Stone A** (left, purple glow) - Moves explorer 1 position
- **Stone B** (center, blue glow) - Moves explorer 5 positions  
- **Stone C** (right, red glow) - Moves explorer 10 positions

**Symbol Reveal (End of Round Only):**
- During gameplay: Stones show NO symbols - only magical glow
- After reaching castle: Cinematic sequence reveals:
  - Stone 1 reveals: **I**
  - Stone 2 reveals: **V**
  - Stone 3 reveals: **X**

**No explanation is given** - students discover the connection themselves.

### Gameplay

1. A random target number (1-20) is displayed
2. Explorer starts at position 0
3. Students click stones to move the explorer
4. Explorer animates along the curved stone path toward the castle
5. Camera follows explorer smoothly
6. When explorer reaches the target:
   - Castle gate opens
   - Confetti and fireworks
   - King appears
   - Cinematic symbol reveal sequence
   - King says: "You have uncovered the symbols of the Ancient Kingdom..."
   - Continue button appears after reveal
7. Click "CONTINUE" for a new round with a new target

### Win Condition

Explorer must reach exactly the target number. If students overshoot, they can continue trying (no penalty).

## Technical Details

### Technologies Used
- **HTML5** - Structure and semantics
- **CSS3** - Styling, animations, glassmorphism effects
- **Vanilla JavaScript** - Game logic, no frameworks

### Browser Compatibility
- Chrome/Edge (recommended)
- Firefox
- Safari
- Any modern browser with ES6 support

### Responsive Breakpoints
- Desktop: > 1200px
- Laptop: 768px - 1200px
- Tablet: 480px - 768px
- Mobile: < 480px

### Accessibility Features
- **Keyboard navigation:** Use Tab to navigate, Enter/Space to activate
- **Keyboard shortcuts:** Press 1, 2, or 3 to activate stones
- **High contrast mode:** Respects system prefers-contrast setting
- **Reduced motion:** Respects system prefers-reduced-motion setting
- **Screen reader friendly:** Proper ARIA labels and semantic HTML
- **Large touch targets:** Minimum 44px for interactive elements

## Customization

### Changing Colors

Edit CSS variables in `style.css`:

```css
:root {
    --color-sky-top: #1a1a2e;
    --color-gold: #ffd700;
    --color-magic-glow: #00ffff;
    /* ... etc */
}
```

### Adjusting Game Settings

Edit constants in `game.js`:

```javascript
const CONSTANTS = {
    MIN_TARGET: 1,
    MAX_TARGET: 20,
    POSITION_MULTIPLIER: 100,
    STONE_A_VALUE: 1,
    STONE_B_VALUE: 5,
    STONE_C_VALUE: 10,
    // ... etc
};
```

### Modifying Stone Symbols

To change what symbols appear on stones, edit in `game.js`:

```javascript
STONE_A_SYMBOL: 'I',
STONE_B_SYMBOL: 'V',
STONE_C_SYMBOL: 'X',
```

## Important Educational Notes

### What This Game Does NOT Do

- ❌ Does NOT teach Roman numeral rules
- ❌ Does NOT explain that I=1, V=5, X=10
- ❌ Does NOT show addition or subtraction
- ❌ Does NOT have quizzes or tests
- ❌ Does NOT have rule books or tutorials
- ❌ Does NOT validate Roman numeral writing
- ❌ Does NOT show educational popups
- ❌ Does NOT reveal symbols during gameplay
- ❌ Does NOT ask "What did you notice?"

### What This Game DOES Do

- ✅ Creates curiosity about symbols
- ✅ Allows discovery through play
- ✅ Shows that symbols can represent quantities
- ✅ Provides a shared experience for class discussion
- ✅ Sets up the teacher for the actual lesson
- ✅ Reveals symbols only at end of round (cinematic moment)

### Teacher's Role

After students play:
1. Ask: "What did you notice about the stones?"
2. Discuss the symbols that appeared at the end
3. Introduce the concept of Roman numerals
4. Explain the rules (I=1, V=5, X=10, etc.)
5. Connect the game experience to the lesson

## Troubleshooting

### Video doesn't play
- Ensure `assets/intro.mp4` exists
- Check browser autoplay permissions
- Game will start directly if video is missing

### No sound
- Ensure audio files exist in `assets/audio/`
- Check browser audio permissions
- Click the mute button to unmute
- Game works without audio (graceful fallback)

### Stones don't respond
- Check if explorer is currently animating
- Wait for animation to complete
- Refresh page if stuck

### Explorer doesn't move
- Check browser console for errors
- Ensure JavaScript is enabled
- Try refreshing the page

## Performance Tips

- For best performance, use Chrome or Edge
- Close other browser tabs for smoother animations
- Use on devices with hardware acceleration
- Reduce particle count in `game.js` if laggy on older devices

## Credits

Created for Teach For India - Grade 5 Mathematics Lesson

Design inspiration: Disney, Pixar, Monument Valley, Duolingo

## License

Educational use only.

## Support

For issues or questions, please contact the Teach For India curriculum team.
