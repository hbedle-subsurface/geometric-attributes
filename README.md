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
Not Track. 


## Sources

The definitions follow the AASPI program documentation for `dip3d`,
`similarity3d` and `curvature3d`, together with the published literature —
Marfurt et al. (1998), Gersztenkorn and Marfurt (1999), Roberts (2001),
al-Dossary and Marfurt (2006), Chopra and Marfurt (2007), Di and Gao (2016),
Qi and Marfurt (2018). Every module's **Method** tab lists its own sources and
states plainly where the implementation simplifies or departs from a production
volume. Module 04, which follows the `similarity3d` documentation closely, also
cites that document by equation number.

Where a source is internally inconsistent, the module says so rather than
quietly picking one. Two examples: the `curvature3d` documentation gives
curvedness both with and without a factor of two, and its shape index appears
with two opposite sign conventions.

## License and citation

Free to use for teaching, demonstration, and non-commercial study, provided the
source is credited. Please do not republish or redistribute it, modified or
otherwise, without permission. If you use it in a course or a talk, a credit
line and a link back are all that is asked.

> H. Bedle, *How Geometric Attributes Actually Work*, University of Oklahoma,
> https://hbedle-subsurface.github.io/geometric-attributes/

The license statement appears in the footer of all eight module pages, and the
citation line on all nine including the landing page, whose footer holds the
citation only. When the SSRN working paper is published, the link needs adding in
ten places: this file and the citation line in each page's footer.

Built for teaching by Heather Bedle, School of Geosciences, University of
Oklahoma, with the AASPI consortium.
