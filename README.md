# How Geometric Attributes Actually Work

Interactive teaching modules on seismic geometric attributes, built for the
School of Geosciences at the University of Oklahoma with the
[AASPI](https://www.ou.edu/mcee/labs/aaspi) consortium.

Live at **https://hbedle-subsurface.github.io/geometric-attributes/**

Every module builds a small synthetic model in the browser, computes a real
attribute on it, and lets the reader change the parameters that are normally
left at their defaults. There is no server and no build step. Nothing that
happens inside a module leaves the browser; the only thing recorded is that a
page was opened (see *Page-view counting* below).

---

## The modules

| # | File | Subject |
|---|------|---------|
| 01 | `modules/dip.html` | Dip: what it is, finding it by eye, and the semblance scan |
| 02 | `modules/dip3d.html` | Inline and crossline dip; apparent versus true dip; azimuth |
| 03 | `modules/dipsteer.html` | Why the analysis window must follow the bed |
| 04 | `modules/coherence.html` | Coherence, similarity and variance: semblance, eigenstructure, energy ratio, Sobel |
| 05 | `modules/curvature.html` | Structural curvature; k₁ and k₂; wavelength |
| 06 | `modules/shape.html` | Curvedness, shape index, shape components |
| 07 | `modules/ampcurv.html` | Amplitude curvature: e_pos and e_neg |
| 08 | `modules/aberrancy.html` | Aberrancy: the third derivative of structure |

They are written to be read in order — module 03 assumes 01 and 02, everything
from 04 on assumes a dip field exists — but each one stands alone if you drop
a student into the middle of the course. Every module links to the next and to
the previous one at the foot of its reference tabs, so the whole set can be
walked through without returning to the index.

## Layout

```
index.html          landing page: hero, module cards
assets/
  count.js          page-view counting, and nothing else
  popout.js         the exercises pop-out button, and nothing else
  seismic.js        SEIS — wavelets, synthetic traces, canvas drawing, colormaps
  attributes.js     ATTR — semblance, dip scans, covariance, eigen, colormaps
  style.css         the whole visual identity, shared by every page
modules/*.html      one self-contained module per file
```

**Shareable links.** Every slider and toggle is written into the querystring as
it moves, so the address bar always holds the current configuration of the
module. Copying it from the address bar hands someone the exact setup, which is
the intended way to distribute a worked example. There is no copy button; the
URL is the feature.

## Page-view counting

`assets/count.js` records that a page was opened, and nothing else. It is loaded
by every page — `assets/count.js` from the root, `../assets/count.js` from
`modules/` — as the first script at the foot of the body.

Counts go to GoatCounter under the account code `hbedle`, shared with the other
teaching repositories served from `hbedle-subsurface.github.io`; the path
distinguishes them, so every module gets its own row at
https://hbedle.goatcounter.com. No cookie is set and no identifier is stored.

The script does not count `file://`, `localhost` or `127.0.0.1`, and honors Do
Not Track. If it fails to load the page carries on unchanged. **Do not modify
those guards, do not add event tracking** — counting page loads is a visitor
log, counting slider moves is watching someone work, and it would contradict
what the site tells people it does — and do not add a second analytics tool.

## Exercise pop-out

`assets/popout.js` puts an **Open in new window** button on the exercises tab of
every module, so a student can read the exercises in a second window while
working the controls in the first. It is loaded by every module as
`../assets/popout.js`, next to `count.js`.

It copies the text already on the page and does nothing else: no fetch, no
storage, no cookie. It works from a `file://` copy with no network. If
`assets/` is stale the button does not appear and the exercises tab is
unchanged, which is why no module carries a local fallback for it.

The same file goes in every teaching repository unchanged; see `ADD-POPOUT.md`
for the procedure and the harness.

## Sources

The definitions follow the AASPI program documentation for `dip3d`,
`similarity3d` and `curvature3d`, together with the published literature —
Marfurt et al. (1998), Gersztenkorn and Marfurt (1999), Roberts (2001),
al-Dossary and Marfurt (2006), Chopra and Marfurt (2007), Di and Gao (2016),
Qi and Marfurt (2018). Every module's **Method** tab lists its own sources and
states plainly where the implementation simplifies or departs from a production
volume. Module 04, which follows the `similarity3d` documentation closely, also
cites that document by equation number.

## Numbers in the exercise hints

The hints describe what the readouts do rather than quoting them to three
decimal places. A hint says the score roughly halves, or that one value is an
order of magnitude above another, or that a ratio is about half again — not
that it is 0.512.

The reason is maintenance. Change a default window, a bed spacing or a noise
seed and every quoted decimal somewhere in the set becomes wrong, silently,
with nothing to catch it. Relative statements survive that; exact ones do not.

Exact figures are still used where the arithmetic guarantees them and no model
constant can move them: the shape index landmarks (+1, +0.5, 0, −0.5, −1), the
candidate counts in a dip search, energy ratio reading exactly 1.000 on a
rank-one covariance matrix, and the identity between energy ratio at L = 1 and
eigenstructure. Those are properties of the definitions, not of the models, and
they are worth stating precisely.

## License and citation

Licensed [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Free
to use, adapt and share, including in teaching and including commercially,
provided the source is credited and any adaptation is released under the same
license. If you use it in a course or a talk, a credit line and a link back are
all that is asked. The full legal text is in `LICENSE` at the repository root.

> H. Bedle and A. Moreno-Ward, *How Geometric Attributes Actually Work*, University of
> Oklahoma,
> https://hbedle-subsurface.github.io/geometric-attributes/

Built for teaching by Dr. Heather Bedle and Dr. April Moreno-Ward, School of
Geosciences, University of Oklahoma, with the AASPI consortium.
