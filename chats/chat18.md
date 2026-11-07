# Mobile drag interaction

_Started 2026-08-16 20:32 UTC_

---

## User

When I'm on mobile I have to tap the screen hold and tap then I can drag.  Is there a way to smooth this experience so it doesn't feel laggy and hard to use?

## Assistant

_[tool: grep]_

_[tool: grep]_

_[tool: read_file]_

_[tool: grep]_

Found it — the map ignores touches that start on a genre node, so you have to hunt for empty space. Fixing that plus adding flick momentum.

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

Now the release: momentum glide, click-suppression release, and rAF-coalesced transforms.

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: read_file]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

The root cause: any touch that landed on a genre node was ignored by the pan handler, so you had to find bare canvas — hence the tap-hold-tap ritual. Now:

- Drag starts anywhere on the map, nodes included. A touch that moves past ~7px pans; one that doesn't still selects the node.
- Flick momentum with decay, so the map keeps gliding and stops when you touch it again.
- Panning no longer fires the node you started on, and the world layer is promoted to its own compositor layer for smoother frames.

## User

Found issues — fixing…

## Assistant

_[tool: get_webview_logs]_

_[tool: grep]_

_[tool: read_file]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

Two follow-up fixes on top of the pan work: pinch gestures no longer leak a stray node tap when you lift your fingers, and dropping from two fingers back to one resets the velocity tracker so the map doesn't jerk into a glide.

## User

I think something regressed it moves barely at all when attempting to drag around

## Assistant

_[tool: read_file]_

Found it: `lostpointercapture` fires the cancel handler the moment the pan threshold sets capture, so the drag dies after ~7px.

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

Fixed. The pan tracking runs on window-level pointer events, so the mid-drag capture call was unnecessary — and it was tripping the `lostpointercapture` cancel handler, stopping every drag right at the threshold. Removed both.

