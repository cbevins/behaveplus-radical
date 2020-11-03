# behaveplus-radical 0.3.0 (Nov 3, 2020)

1 [FEATURE] Added this `RELEASE_NOTES.md` file.

---

2 [FEATURE] Added `behaveplus/genome/site.doc.js` with following Nodes:
  - `site.doc.date`
  - `site.doc.id`
  - `site.doc.location`
  - `site.doc.station`
  - `site.doc.time`

  which, after running `compiler` and `nodeList`, results in new versions of:
  - `BpxDna.js`,
  - `BehavePlusNodesAlphabeticalOrder.js`, and
  - `BehavePlusNodesTopologicalOrder.js`

---

3 [BUG FIX] Chaparral and westernAspen fuelType 'none' replaced with valid values.

  - `FuelCatalog.chaparralFuelType (alias)`
    - when `domain` is NOT `'chaparral'`, `fuelType` is now `'chamise'` instead of `'none'`

  - `FuelCatalog.westernAspenFuelType (alias)`
    - when `domain` is NOT `'westernAspen'`,`fuelType` is now `'aspenShrub'` instead of `'none'`

---

# behaveplus-radical 0.2.0 (Oct 22, 2020)

---

# behaveplus-radical 0.1.0