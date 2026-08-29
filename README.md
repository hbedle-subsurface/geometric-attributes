# How Geometric Attributes Actually Work

Interactive teaching modules on seismic geometric attributes, built for the
School of Geosciences at the University of Oklahoma with the
[AASPI](https://www.ou.edu/mcee/labs/aaspi) consortium.

Live at **https://hbedle-subsurface.github.io/geometric-attributes/**

Every module builds a small synthetic model in the browser, computes a real
attribute on it, and lets the reader change the parameters that are normally
left at their defaults. There is no server, no build step, and no data leaves
the reader's machine.

---

## The modules

| # | File | Subject |
|---|------|---------|
| 01 | `modules/dip.html` | Dip: what it is, finding it by eye, and the semblance scan |
| 02 | `modules/dip3d.html` | Inline and crossline dip; apparent versus true dip; azimuth |
| 03 | `modules/dipsteer.html` | Why the analysis window must follow the bed |
| 04 | `modules/coherence.html` | Semblance, variance, eigenstructure, energy ratio, Sobel |
| 05 | `modules/curvature.html` | Structural curvature; k₁ and k₂; wavelength |
| 06 | `modules/shape.html` | Curvedness, shape index, shape components |
| 07 | `modules/ampcurv.html` | Amplitude curvature: e_pos and e_neg |
| 08 | `modules/aberrancy.html` | Aberrancy: the third derivative of structure |

They are written to be read in order — module 03 assumes 01 and 02, everything
from 04 on assumes a dip field exists — but each one stands alone if you drop
a student into the middle of the course.

## Layout

```
index.html          landing page: hero, module cards
assets/
  seismic.js        SEIS — wavelets, synthetic traces, canvas drawing, colormaps
  attributes.js     ATTR — semblance, dip scans, covariance, eigen, colormaps
  style.css         the whole visual identity, shared by every page
modules/*.html      one self-contained module per file
```

Each module is a single HTML file containing its own markup and its own script.
That is deliberate: a module can be copied, emailed, or opened from disk and it
still works, and editing one cannot break another.

## Running it

Open `index.html` in a browser. That is the whole procedure.

Modules also work opened directly from the file system, with one limitation:
shareable-link state (the querystring that records slider positions) is disabled
under `file://` because browsers reject `history.replaceState` there. Everything
else behaves identically.

To publish, push to the `gh-pages`-enabled branch. **Push `assets/` whenever a
module changes** — several modules depend on functions added to the shared
libraries, and a stale `assets/` is the single most common cause of a module
looking broken. Stylesheets in particular cache hard; if a layout change does
not appear, open `assets/style.css` directly in the browser and check that the
change is actually there before debugging anything else.

## How a module is put together

**A sticky lab header** holds whatever the reader needs to keep touching — the
live data panel, the controls, or both. It stays on screen while the panes
below change, because changing a parameter and seeing the answer move is the
entire point and cannot happen if the two are never visible at once.

**Tabs** below it, one pane per step, then `Why it matters`, `Exercises`,
`Key points` and any reference panes. Only the visible pane is drawn: a canvas
in a hidden pane has zero width, so anything drawn there comes out at zero size.

**Exercises** carry their answers behind a `<details class="reveal">` toggle
labelled *Hint*, so a reader can try before reading.

**Shared components** live in `style.css`: `.labhead`, `.tabs`, `.tabpane`,
`.stepnav`, `details.reveal`, `.thumb`. Reuse them rather than restyling.

## Conventions

- **American spelling** throughout: color, center, normalized, gray, meters.
- **Every attribute map gets a color bar** that says what the colors mean. A
  reader should never have to guess whether blue is high or low.
- **Cyclic quantities get cyclic scales.** Dip azimuth wraps at 360°, curvature
  strike at 180° because it is an orientation, aberrancy azimuth at 360° because
  it is a direction. A non-wrapping scale draws a false lineament.
- **Depth reads the way an interpreter expects**: negative, more negative
  downward, on a datum.
- **Numbers in the prose are measured, not estimated.** If an exercise says an
  attribute reads 0.786, that value was read out of the running page.

## Editing notes

These are the mistakes that have actually been made in this repo. They are all
silent — the page still renders, it just renders something wrong.

- **Canvas width.** Size canvases to the parent's *content* box, not
  `clientWidth`, which includes padding. A tab pane has 26 px of it, so a
  full-width panel drawn to `clientWidth` overruns its container by 52 px.
- **Map aspect.** A grid with equal bin spacing in both directions must be drawn
  into a *square* plot box. Drawn into whatever rectangle is available, a dome
  becomes an ellipse and every azimuth read off the map is wrong.
- **Splitting the two-column teach block** into separate Exercises and Key
  points panes leaves one extra `</div>` every time, which silently nests the
  exercises inside the previous pane. Run a nesting check after doing it.
- **Fixed axes.** If an axis rescales while a slider moves, the curve stays the
  same size on screen and the change being demonstrated is invisible.
- **Sliders that do nothing.** Noise added to a quantity that is then smoothed
  several times may not survive to the output. Measure the response across the
  slider's range before believing it works.
- **Statistics that sample a fixed column** break the moment a feature is given
  a dip. If the fault leans, whatever measures it has to lean too.
- **Debounced recomputation** means an automated check that reads a value
  immediately after moving a slider will read the old one. Wait for it.

## Sources

The definitions follow the AASPI program documentation for `dip3d`,
`similarity3d` and `curvature3d`, together with the published literature —
Marfurt et al. (1998), Gersztenkorn and Marfurt (1999), Roberts (2001),
al-Dossary and Marfurt (2006), Chopra and Marfurt (2007), Di and Gao (2016),
Qi and Marfurt (2018). Each module's **Method** tab cites its own sources by
equation number where the documentation gives one, and states plainly where the
implementation simplifies or departs from a production volume.

Where a source is internally inconsistent, the module says so rather than
quietly picking one. Two examples: the `curvature3d` documentation gives
curvedness both with and without a factor of two, and its shape index appears
with two opposite sign conventions.

## Licence and citation

Free to use for teaching, demonstration, and non-commercial study, provided the
source is credited. Please do not republish or redistribute it, modified or
otherwise, without permission. If you use it in a course or a talk, a credit
line and a link back are all that is asked.

> H. Bedle, *How Geometric Attributes Actually Work*, University of Oklahoma.
> SSRN: *[article link to follow]*

Built for teaching by Heather Bedle, School of Geosciences, University of
Oklahoma, with the AASPI consortium.
