# behaveplus-radical Release Notes

## 0.3.2 (Jan 25, 2021)

### 1 [BUG FIX] Node.displayValue()

Node.displayValue() now correctly converts Quantitys whose native units-of-measure are not in the 'ft/lb/min/Btu/F' set.  This had affected display of fireline intensity, map distances, and tree dbh and bark thicknesses.

---

## 0.3.1 (Nov 28, 2020)

## 1 Modified .npmrc

---

## 0.3.0 (Nov 3, 2020)

## 1 [FEATURE] Added this `RELEASE_NOTES.md` file.

---

## 2 [FEATURE] Added `behaveplus/genome/site.doc.js` with following Nodes:
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

## 3 [BUG FIX] Chaparral and westernAspen fuelType 'none' replaced with valid values.

  - `FuelCatalog.chaparralFuelType (alias)`
    - when `domain` is NOT `'chaparral'`, `fuelType` is now `'chamise'` instead of `'none'`

  - `FuelCatalog.westernAspenFuelType (alias)`
    - when `domain` is NOT `'westernAspen'`,`fuelType` is now `'aspenShrub'` instead of `'none'`

---

## 0.2.0 (Oct 22, 2020)

---

## 0.1.0 (Sep 4, 2020)