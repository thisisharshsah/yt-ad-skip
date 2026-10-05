# YouTube Ad Skip (personal)

Skips YouTube video ads (presses Skip, or mutes and jumps to the end of ads
that can't be skipped), closes overlay banners, and hides ad slots in the
feed, sidebar and search. Kept separate from Aurovie Jobs on purpose, and not
meant for the Chrome Web Store.

## Install

1. Open `chrome://extensions` and turn on **Developer mode** (top right).
2. **Load unpacked** and pick this folder.
3. Reload any open YouTube tabs.

After editing a file, press the reload icon on its card at `chrome://extensions`.

## When it stops working

YouTube renames things now and then. The names to update are at the top of
`skip.js` (the Skip button) and in `hide.css` (ad slots). The player is marked
with the class `ad-showing` while an ad plays.
