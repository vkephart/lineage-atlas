# iOS drag performance issue

_Started 2026-10-24 08:25 UTC_

---

## User

I’m noticing the drag on iOS is latent again, did something regress?

## Assistant

_[tool: grep]_

_[tool: list_versions]_

_[tool: grep]_

_[tool: read_file]_

_[tool: grep]_

_[tool: read_file]_

_[tool: grep]_

_[tool: grep]_

_[tool: list_versions]_

_[tool: get_version]_

_[tool: get_version]_

_[tool: read_file]_

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: read_file]_

No code regression in the drag path itself — it's still direct-DOM pointer handling. Checking the glide/hover code before I conclude:

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

Nothing in the drag handlers regressed — they're unchanged since the August fixes. The lag is cumulative: ~15 new genre nodes and their edges since the last perf pass, each with a blurred glow, pushed iOS's tile re-rasterization past the frame budget on that 3600×3800px pan layer.

Fix applied: while a touch pan, pinch, or momentum glide is live, node glows/transitions and edge labels are suppressed (desktop mouse drags untouched), restored the moment motion settles. This also scales as you keep adding genres. Worth a check on your phone — if it's still not crisp, the next lever is thinning the dashed edge strokes at low zoom.

