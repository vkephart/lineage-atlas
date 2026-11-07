# Trackball mouse scroll issue

_Started 2026-10-08 03:10 UTC_

---

## User

Something that is driving me crazy is on my desktop I don't have a track pad, I have a trackball mouse, and when i twist the scroll it doesn't zoom the page in/out.  Can you fix this.

## Assistant

_[tool: grep]_

_[tool: read_file]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: read_file]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

I've fixed it so scrolling your trackball or mouse wheel zooms the map in and out, centred on the cursor. I couldn't test it with a real trackball here, so please give it a try.

- **Mouse and trackball:** the map used to zoom only when your device reported scroll steps of exactly one size, which many mice and trackballs don't. It now treats any wheel-style scroll as zoom, and zooms faster or slower depending on how far you turn.
- **Trackpads:** two-finger scrolling still pans, and pinching still zooms.
- **Shift + scroll:** pans sideways.
- I updated the hint text on the map to match.

If it zooms too fast or too slow, tell me and I'll adjust the speed.

## User

That's good, we also need to fix the journey because there are so many connection e.g., in Gaze & Post punk it's hard to follow it' just start lighting up 10 fo connections at once?

## Assistant

_[tool: grep]_

_[tool: read_file]_

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: read_file]_

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

I took "Gaze & Post-Punk" to mean the family highlight you get by clicking the family's name, since the guided journeys only light the links between their own steps. When you click a family now:

- **Fewer links lit:** only connections inside the family light up. Links to other families stay as faint lines in the background.
- **One at a time, oldest first:** the links light up one after another over about 3 seconds, so you can follow the lineage forward in time.
- **No label pile-up:** the link labels no longer all appear at once. Clicking a link still shows its label.

A checker is still reviewing the change. If you meant one of the guided journeys rather than the family highlight, tell me which one.

## User

when I click on a Lineage the screen should auto center on that trail optimized for the display size it's on so the user doesn't need to scrool to where it is.

## Assistant

_[tool: grep]_

_[tool: read_file]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: grep]_

_[tool: ready_for_verification]_

The map now centres and zooms itself to fit what you click, so you don't have to scroll to find it. It sizes the view to your screen and leaves room for the header and the bottom panel or timeline. A checker is still reviewing the change.

- **Clicking a lineage** (like Gaze & Post-Punk): the map moves to show every genre in that family.
- **Starting a curated journey:** the whole trail fits on screen when it fits at a readable size.
- **Moving through a journey:** the view follows the trail so far plus the next step. If a trail is too long to read at once, it shows the current step with the ones before and after it.

## User

Found issues — fixing…

## Assistant

_[tool: grep]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

The auto-fit now leaves room for every panel on screen, including the open Legend & Filter panel, so lineage genres no longer end up hidden behind it. It also allows for the header, side panels, the focus label on mobile, and the timeline or journey panel. For each one it keeps clear whichever edge leaves the most room for the map. A checker is still reviewing the change.

## User

Maybe this is just how it has to be, but because we have so many genre lines it looks a little messy.  I like the edge types and the ability to follow those, so before you make any changes are there any design options to make it easier for the eyes?

## Assistant



## Assistant

Those long vertical lines are links between families that cross the whole map, and they cause most of the mess. Here are some options, starting with the biggest win:

1. **Quieter lines when nothing is selected.** Drop resting lines from about 22% to about 8% opacity. Hovering, selecting, focusing a family or running a journey still lights them at full strength.
2. **Hide cross-family links when nothing is selected.** Only links inside a family show until you hover, click or focus. This removes most of the vertical clutter.
3. **Solid lines when nothing is selected, dash patterns on highlight.** Overlapping dashes make the map look busy. Resting lines would be thin and solid, and the edge-type patterns appear when a line is lit.
4. **Grey lines when nothing is selected.** Lines take their family colour only when highlighted, so the coloured genre circles stand out.
5. **More lines as you zoom in.** Zoomed out shows only the strongest links, and weaker ones fade in as you zoom.
6. **Bundled cross-family links.** Links between two families merge into shared paths, like a transit map. This is the cleanest look but a bigger change, and some links get harder to tell apart.
7. **Lines light up near the cursor.** Moving the mouse brightens the lines nearby. Desktop only.

I'd suggest 1, 2 and 3 together. They keep every edge type and every way of following a link, and change only how the map looks when nothing is selected.

_[tool: ask_user]_

Pick the options you want in the form, and say whether to apply them straight away or add a switch so you can compare before and after.

## User

<artifact-content-authored-by-others/>
Answered — options: 1 · Quieter lines when nothing is selected

## Assistant

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

I made the connection lines quieter when nothing is selected. Regular lines are now about 8% visible (they were 22%), and bridge lines are about 12% (they were 34%). Hovering, selecting, focusing a family or running a journey still lights the relevant lines at full strength.

If they now feel too faint, tell me and I'll bring them up a little.

## User

ok, better, we need to clean up the rock and electronic areas, see ss's.

## Assistant

_[tool: read_file]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: show_html]_

_[tool: ready_for_verification]_

I added a spacing step to the map layout so overlapping genres push apart, which fixes pile-ups like Heavy Psych and Southern Rock, Trance and IDM, and Post-Hardcore and Madchester. It mostly moves genres up or down. Sideways moves are kept to 70px, so the timeline still reads correctly. A checker is reviewing the result and will tell me if any overlaps remain.

- Genres stay inside their own family's row.
- The connection lines follow the new positions.
- The rock row is the most crowded. If there isn't room to space every rock genre within the row, a few could still touch. The fix would be to make that row taller.

## User

Found issues — fixing…

## Assistant

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

The first spacing pass still left 22 overlaps, so I've reworked it. A checker is now measuring the new layout.

- **Room to spread up and down:** genres can now spread a little past the strict row edge.
- **Less pile-up at the edges:** when a genre hits its row edge, the other genre moves instead. This stops nodes stacking on the boundary, as Glam Rock and Eurodance did.
- **More sideways room:** genres can now shift up to 110px left or right, which helps where several started in the same year.
- **Runs until clear:** the layout keeps adjusting until nothing overlaps or it reaches a set limit.

## User

Found issues — fixing…

## Assistant

_[tool: grep]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

The last pass cleared every overlap but pushed some genres into a neighbouring family's row, so I made the most crowded rows taller instead. A checker is now measuring overlaps and row edges again.

- **More room:** the Rock and Electronic rows are about 180px and 140px taller, and the gaps around them grew to match. The map is 280px taller overall.
- **Genres stay in their row:** each genre now has to stay inside its own family's row. The few genres originally placed past a row edge, such as Glam Rock and Eurodance, stay where they were.

## User

Found issues — fixing…

## Assistant

_[tool: grep]_

_[tool: read_file]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

The overlaps kept coming back because the spacing pass pushed genres before checking how far they could move. A genre already at its row edge got pushed anyway, the move was undone, and the pair never separated.

I've rewritten it so each push first checks how much room each genre has, both up and down within its row and up to 160px sideways. It uses whichever direction has room, splits the move between the two genres, and keeps going until nothing overlaps.

A checker is measuring the new layout now.

## User

Found issues — fixing…

## Assistant

The pairwise nudging can't settle dense same-year columns, because neighbouring genres keep undoing each other's moves. I'm replacing it with a placement pass that can't oscillate: genres are placed one at a time, most connected first. Each takes the nearest free spot to its authored position, searching within its row and up to ±160px sideways.

_[tool: read_file]_

_[tool: run_script]_

_[tool: ready_for_verification]_

I've replaced the spacing logic with a new placement step. Genres are placed one at a time, most-connected first. Each takes the free spot nearest its original position, inside its own row and at most 160px sideways. Sideways moves cost more than up-and-down moves, so the timeline stays as accurate as possible.

Because each genre is placed once and never moved again, this method can't get stuck the way the earlier versions did. A checker is measuring it now.

The overlaps had kept coming back because neighbouring genres kept pushing each other back. The 1992–93 electronic cluster needs about 600px of height but its row only has about 320px, so it never settled.

## User

ok, last thing for tonight, this is what a fully illuminated lineage looks like, not exactly visible, what can be done here?

## Assistant

_[tool: list_files]_

No screenshot came through with your message, only the text. Could you paste it again?

From your description, the likely problems are:

- **Hard to read lines:** lit lines are thin and use the family's colour on a dark background. For purple and blue families in particular, that gives low contrast.
- **No order:** everything lights at about 95% at once, so nothing shows which way the lineage flows.
- **Labels hidden:** link labels are now hidden during a family focus.

Options:

1. **Brighter lit lines.** Make them thicker and add a soft glow, so they stand out from the faint background lines.
2. **Show which way each link flows.** A slow pulse moving from parent genre to child, or small arrowheads.
3. **Fade the other families further,** so the lit lineage is the only coloured thing on screen.
4. **Show each genre's year and parents on hover** while a lineage is lit.

Send the screenshot and I'll confirm which of these fit what you're seeing.

## User

look at it:

## Assistant



## Assistant

The screenshot shows the main problem: when you focus a family, every connection inside it lights at the same brightness, thickness and colour. That's about 80 lines in Rock, all looking equally important, so it reads as a tangle. Lines also cut through labels.

What could help:

1. **Main lineage only.** Each genre's strongest parent link lights fully, which turns the tangle into a readable family tree. Secondary links (stylistic, scene, production) stay faint until you hover a genre.
2. **Line weight by strength.** Lit lines range from thin to thick depending on how strong the link is, at slightly lower opacity. Strong links stand out instead of everything blending together.
3. **Labels in front of lines.** Each label gets a dark backing and lines pass behind the circles, so names stay readable.
4. **Hover inside a focused family.** Pointing at a genre dims the rest and shows only its parents and children.
5. **Colour by edge type while focused.** All Rock lines are currently orange. In focus mode, colouring lines by relation type (origin, stylistic, revival and so on) would make the edge types you like readable.
6. **Moving time window.** As the timeline plays, links near the current year are bright and older ones fade back.

I'd suggest 1, 3 and 4 together. That gives a clean tree by default and keeps every connection a hover away.

_[tool: ask_user]_

Choose the options you want in the form and I'll apply them.

## User

<artifact-content-authored-by-others/>
Answered — options: 1 · Main lineage only, 3 · Labels in front of lines, 4 · Hover inside a focused family

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

I've applied options 1, 3 and 4. A checker is reviewing them now.

1. **Main lineage only:** focusing a family now lights just each genre's strongest parent link within the family, preferring origin links. That turns the tangle into a family tree, still drawn one link at a time, oldest first. The family's other links stay faint, and links to other families are fainter still.
2. **Labels in front:** genre circles now have a solid dark base, so lines no longer show through them. Each label has a dark backing, so names stay readable over the lines.
3. **Hover inside a focused family:** pointing at a genre lights all of its parent and child links. The rest of the family dims to about 40% so you keep your bearings.

## User

Found issues — fixing…

## Assistant

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

I fixed a bug I'd introduced in the last change. It stopped links from lighting up anywhere: in family focus, on hover, and when you selected a genre. Links light again in all three. A checker is confirming it now.

