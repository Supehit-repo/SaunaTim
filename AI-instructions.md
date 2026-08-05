# Sauna Tim - AI Notes

## Project

- Local folder: `E:\Pelit\SaunaTIM\SaunaTim`
- Repository: `https://github.com/Supehit-repo/SaunaTim`
- Branch policy from user: keep work on `main`, avoid extra branches.
- Delivery target: browser game that works by opening `index.html` directly. Do not introduce a required build step, module imports, package manager dependency, or server-only asset loading.

## Architecture

- `index.html` loads classic scripts in order.
- `src/config.js`: viewport, physics, launch points, legacy internal heat/HP constants.
- `src/state.js`: mutable game state factory.
- `src/game.js`: main game loop, turns, scoring resolution, round progression.
- `src/input.js`: pointer/keyboard input.
- `src/systems/`: scoring, effects, NPC throw generation, progression, audio.
- `src/render/`: canvas render modules. `thermometers.js`, `props.js` and `background-cleanup.js` are separate so gameplay UI can evolve without repainting the base image every time.
- `assets/sauna-background.png`: original-style background image. Prefer light runtime overlays/cleanup over destructive raster edits unless the user explicitly asks for an image repaint.

## Current Direction

- Keep the sauna background, stove, Tim and Ivan visually close to the existing demo.
- Avoid large rectangular patches over art. If cleanup is needed, keep it subtle and localized.
- The game should remain landscape-first and scale on mobile.
- UI should be in Finnish.
- Finnish text must remain valid UTF-8. PowerShell output may show mojibake; verify in browser or with UTF-8-aware checks before assuming text is broken.

## Recently Implemented

- Refactored the original demo into separate browser-ready files.
- Added best-of-three match structure.
- Reduced internal max heat/HP value to 350 before replacing the visible HP UI with energy numbers and hearts.
- Ivan starts round 2.
- Removed steam icons and turn timer UI from the visible game.
- Added wins, round text, firewood, skin redness, hand ladles and bucket/ladle visual cleanup.
- Reduced throw wobble so aiming feels steadier.

## This Sprint

Numbered tasks came from `todo.txt`.

- Correct round winner copy: `Sinä voitit kierroksen!`
- Add a small fanfare/confetti burst on round win.
- Remove the unwanted visual trail from Tim's bucket/aiming.
- Animate the ladle/bucket during throws.
- Change `Sinun vuoro` to `Sinun vuorosi`.
- Add livelier fire when score is 90 or more.
- Hide the `Ivan tähtää` message.
- Add sauna thermometers above Tim and Ivan, from about 65 to 100 as heat rises.
- Replace visible HP text/bar with an energy meter that shows `350/350` plus a heart. Do not show the letters `HP` in the visible energy meter.
- Add generated Web Audio sounds for water hiss, quiet fire crackle and Ivan low-heat grunt.
- Aiming now renders a dynamic throw arc while dragging. Do not use the old ball-style target marker.
- Projectile trail rendering was removed to avoid the unwanted water trail.

## Latest Sprint

Tasks came from the newer `todo.txt`.

- Added numeric energy values beside the heart: initial visible value is `350/350` plus a heart, with no `HP` text.
- Cleaned `assets/sauna-background.png` from the old static dotted throw trail by detecting the white trajectory components and inpainting only those small spots.
- Restored the drag-time aiming arc and removed the ball-style aim indicator.
- Extended the water hiss after stove hits in `src/systems/audio.js`.
- iOS audio is primed in the first touch gesture and effects wait until the Web Audio context is running.
- Nallemehu is a player-only event: Ivan's projectile cannot arm or hit its bottle.
- Moved wall thermometers slightly upward/farther from Tim and Ivan heads in `src/render/thermometers.js`.
- Increased hand ladle swing duration/amplitude so the throwing vessels visibly move during throws.

## State Notes

- `player.hp` remains the internal heat/damage value even though HP text is not shown to the player.
- `player.heartPulse` drives the visible heart beat after a hit.
- `state.fireBoost` temporarily intensifies stove flames after 90+ scores.
- `state.ladleSwing[index]` animates the hand ladle during a throw.
- Thermometers show the same temperature on both sides, based on the hottest current player heat value.

## Development Notes

- Update `readme.txt` for user-facing feature/run notes when behavior changes.
- Update this file when architecture, state shape, or important constraints change.
- Before finalizing, run at least syntax checks and a browser smoke test if possible.
