/* ===========================================================================
   attributes.js — geometric attribute computation
   "How Geometric Attributes Actually Work"
   Heather Bedle / AASPI / University of Oklahoma

   Companion to seismic.js, which supplies wavelets, convolution, colour maps,
   the FFT and the canvas helpers. This file holds the attribute algorithms
   themselves, written the way the textbooks describe them rather than in any
   optimised form, so the code can be read alongside the module that uses it.

   Everything here is 2D (one inline). Crossline dip, dip azimuth and the true
   3D forms arrive with the later modules; where a 2D form is a simplification
   of a 3D one, the comment says so.
   =========================================================================== */

const ATTR = (function () {
  'use strict';

  /* ---------------------------------------------------------------------
     SEMBLANCE

     The quantity nearly every geometric attribute is built on. For J traces
     over a window of K samples,

         semblance = mean over k of ( sum_j a_jk )^2
                     -------------------------------------
                     J * mean over k of sum_j a_jk^2

     It is 1 when every trace in the window is identical and falls toward 1/J
     when they are unrelated. Marfurt et al. (1998) introduced it as a coherence
     measure; here it is also the thing a dip scan maximises.
     --------------------------------------------------------------------- */

  function semblance(gather, J, K) {
    let num = 0, den = 0;
    for (let k = 0; k < K; k++) {
      let s = 0, ss = 0;
      for (let j = 0; j < J; j++) {
        const v = gather[j * K + k];
        s += v; ss += v * v;
      }
      num += s * s;
      den += ss;
    }
    if (den < 1e-20) return 0;
    return num / (J * den);
  }

  /* ---------------------------------------------------------------------
     SAMPLING ALONG A DIP

     A candidate dip p is a time shift per trace. Gathering along it means
     reading each neighbouring trace at a time offset of p times its distance
     from the centre, with linear interpolation because that offset is almost
     never a whole sample.
     --------------------------------------------------------------------- */

  function gatherAlongDip(field, nx, nt, ix, it, p, half, kHalf, out) {
    const J = 2 * half + 1, K = 2 * kHalf + 1;
    for (let j = -half; j <= half; j++) {
      const jx = Math.min(nx - 1, Math.max(0, ix + j));
      const shift = p * j;                       // samples, may be fractional
      for (let k = -kHalf; k <= kHalf; k++) {
        const pos = it + k + shift;
        const i0 = Math.floor(pos), f = pos - i0;
        let v = 0;
        if (i0 >= 0 && i0 < nt - 1) {
          v = field[jx * nt + i0] * (1 - f) + field[jx * nt + i0 + 1] * f;
        } else if (i0 >= 0 && i0 < nt) {
          v = field[jx * nt + i0];
        }
        out[(j + half) * K + (k + kHalf)] = v;
      }
    }
    return out;
  }

  /* ---------------------------------------------------------------------
     DIP SCAN

     The estimator: try a fan of candidate dips, gather along each, and keep
     the one whose semblance is highest. This is the discrete dip search of
     Marfurt et al. (1998). It is deliberately brute force — the point of the
     module is to let a student watch the search happen and see the winning
     dip fall out of a curve, rather than appear from a closed form.

     Returns { p, sem, curve } with p in samples per trace, and curve holding
     the semblance at every candidate so the search can be plotted.
     --------------------------------------------------------------------- */

  function dipScan(field, nx, nt, ix, it, opts) {
    const o = opts || {};
    const half = o.half === undefined ? 2 : o.half;       // traces either side
    const kHalf = o.kHalf === undefined ? 5 : o.kHalf;    // samples either side
    const pMax = o.pMax === undefined ? 4 : o.pMax;       // samples per trace
    const nP = o.nP === undefined ? 41 : o.nP;

    const J = 2 * half + 1, K = 2 * kHalf + 1;
    const buf = new Float64Array(J * K);
    const curve = new Float64Array(nP);
    let best = -1, bestP = 0, bestI = 0;

    for (let i = 0; i < nP; i++) {
      const p = -pMax + (2 * pMax * i) / (nP - 1);
      gatherAlongDip(field, nx, nt, ix, it, p, half, kHalf, buf);
      const s = semblance(buf, J, K);
      curve[i] = s;
      if (s > best) { best = s; bestP = p; bestI = i; }
    }

    // Parabolic refinement on the winning sample, so the estimate is not
    // quantised to the candidate spacing. Real implementations do the same.
    let p = bestP;
    if (bestI > 0 && bestI < nP - 1) {
      const a = curve[bestI - 1], b = curve[bestI], c = curve[bestI + 1];
      const den = a - 2 * b + c;
      if (Math.abs(den) > 1e-12) {
        const step = (2 * pMax) / (nP - 1);
        p = bestP - 0.5 * step * (c - a) / den;
      }
    }
    return { p, sem: best, curve, pMax, nP };
  }

  /**
   * Dip everywhere, on a decimated grid.
   *
   * Production code estimates dip at every sample; this decimates and
   * interpolates for display, because a full-density scan of a few hundred by
   * a few hundred with forty candidate dips is tens of millions of operations
   * and would make the sliders stutter. The decimation is a display choice,
   * not part of the method, and the module says so.
   */
  function dipField(field, nx, nt, opts) {
    const o = opts || {};
    const dx = o.decX || 2, dt = o.decT || 3;
    const gx = Math.ceil(nx / dx), gt = Math.ceil(nt / dt);
    const p = new Float32Array(gx * gt);
    const sem = new Float32Array(gx * gt);
    for (let a = 0; a < gx; a++) {
      const ix = Math.min(nx - 1, a * dx);
      for (let b = 0; b < gt; b++) {
        const it = Math.min(nt - 1, b * dt);
        const r = dipScan(field, nx, nt, ix, it, o);
        p[a * gt + b] = r.p;
        sem[a * gt + b] = r.sem;
      }
    }
    return { p, sem, gx, gt, decX: dx, decT: dt };
  }

  // bilinear read from a decimated grid, in full-resolution coordinates
  function sampleGrid(g, arr, ix, it) {
    const a = Math.min(g.gx - 1.001, Math.max(0, ix / g.decX));
    const b = Math.min(g.gt - 1.001, Math.max(0, it / g.decT));
    const a0 = Math.floor(a), b0 = Math.floor(b);
    const fa = a - a0, fb = b - b0;
    const v00 = arr[a0 * g.gt + b0], v10 = arr[(a0 + 1) * g.gt + b0];
    const v01 = arr[a0 * g.gt + b0 + 1], v11 = arr[(a0 + 1) * g.gt + b0 + 1];
    return (v00 * (1 - fa) + v10 * fa) * (1 - fb) + (v01 * (1 - fa) + v11 * fa) * fb;
  }

  /* ---------------------------------------------------------------------
     UNIT CONVERSIONS

     Dip is computed in samples per trace, which is the natural unit for the
     algorithm and a meaningless one for an interpreter. These convert it into
     the two forms people actually quote.
     --------------------------------------------------------------------- */

  // samples/trace -> milliseconds per trace
  const dipToMsPerTrace = (p, dtSec) => p * dtSec * 1000;

  // samples/trace -> geological dip in degrees, given trace spacing and velocity.
  // Time dip dt/dx relates to true dip theta by dt/dx = 2 sin(theta) / V.
  function dipToDegrees(p, dtSec, dxM, vMs) {
    const timeDip = (p * dtSec) / dxM;          // s per m, two-way
    const s = (timeDip * vMs) / 2;
    return Math.abs(s) >= 1 ? 90 * Math.sign(s) : Math.asin(s) * 180 / Math.PI;
  }

  /* ---------------------------------------------------------------------
     COLOUR MAPS FOR ATTRIBUTES

     Attribute displays have their own conventions, and they matter. Dip is
     signed, so it needs a diverging map with a neutral centre. Coherence runs
     0 to 1 and is shown with low values dark, because faults are what you are
     looking for and they should read as the ink on the page.
     --------------------------------------------------------------------- */

  function ramp(stops, signed) {
    return function (u) {
      const v = signed ? (Math.max(-1, Math.min(1, u)) + 1) / 2
                       : Math.max(0, Math.min(1, u));
      const q = v * (stops.length - 1);
      const i = Math.min(stops.length - 2, Math.floor(q)), f = q - i;
      const a = stops[i], b = stops[i + 1];
      return [Math.round(a[0] + (b[0] - a[0]) * f),
              Math.round(a[1] + (b[1] - a[1]) * f),
              Math.round(a[2] + (b[2] - a[2]) * f)];
    };
  }

  const MAPS = {
    // signed dip: brown for one direction, teal for the other, pale at flat.
    // Avoids red/green, and the two ends are told apart by lightness as well
    // as hue so it survives greyscale printing.
    dip: ramp([
      [92, 48, 12], [150, 96, 32], [205, 165, 105], [246, 244, 238],
      [140, 197, 200], [46, 132, 150], [16, 62, 88],
    ], true),
    // coherence: 1 is white, 0 is black. Discontinuities are the ink.
    coherence: ramp([
      [8, 10, 12], [58, 62, 68], [122, 128, 134], [190, 194, 198], [252, 252, 250],
    ], false),
    // semblance during a scan, warm so it reads against the crimson accent
    scan: ramp([
      [252, 250, 246], [253, 231, 160], [247, 190, 90], [233, 131, 60],
      [196, 60, 45], [110, 16, 20],
    ], false),
  };

  /* --------------------------------------------------------------------- */

  return {
    semblance, gatherAlongDip, dipScan, dipField, sampleGrid,
    dipToMsPerTrace, dipToDegrees, MAPS, ramp,
  };
})();
