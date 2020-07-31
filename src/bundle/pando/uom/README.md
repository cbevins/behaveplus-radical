# behaveplus-uom
Units-of-measure conversion package for use with behaveplus-variant and behaveplus-core.

---

## Basic Usage

```js
import * as Uom from 'behaveplus-uom'

const milesPerHour = Uom.convert(123.45, 'ft/min', 'mi/h')

const conversionFactor = Uom.factor()
```

---

## Usage by behaveplus-dag

When receiving a Quantity variant input amount from the client, first convert it from the client's display/input units-of-measure into the Node's Quantity base units-of-measure amout via:

```js
const clientInputAmount = 1.23
const clientDisplayUnits = 'ton/ac'
node.value.current = Uom.baseAmount(clientInputAmount, clientDisplayUnits)
```

When displaying a Quantity variant value to the client, convert it from the Node's Quantity base value into the client's display/output units-of-measure via:

```js
node.value.current = 1.234
const clientDisplayUnits = 'ton/ac'
const clientDisplayAmount = Uom.asAmount(node.value.current, clientDisplayUnits )
```

---

## Supported Fundamental Units-of-Measure

The `factor()` function implements a simple parser for destructuring a units-of-measure string into its fundamental components while accumulating thier individual conversion factors.  As a result, only a small number of fundamental units-of-measure conversion factors are required to support conversions between much larger number of combinatorial units-of-measure.

`factor()` (and therefore all the other functions in this package) understands units-of-measure strings that combine any of the following sub-strings and their exponents:

<a id='uom'></a>
<table border='1'>
  <tr bgcolor='gray'><td>distance</td><td>base = 'ft'</td></tr>
  <tr><td>ft</td><td> 1 (based on UCUM code [ft_us], NOT [ft_i])</td></tr>
  <tr><td>ch</td><td> 1 / 66</td></tr>
  <tr><td>in</td><td> 12</td></tr>
  <tr><td>mi</td><td> 1 / 5280</td></tr>
  <tr><td>yd</td><td> 1 / 3</td></tr>
  <tr><td>m</td><td> 0.3048</td></tr>
  <tr><td>cm</td><td> 30.48</td></tr>
  <tr><td>mm</td><td> 304.8</td></tr>
  <tr><td>km</td><td> 0.0003048</td></tr>

  <tr bgcolor='gray'><td>energy</td><td>base = 'btu'</td></tr>
  <tr><td>btu</td><td>1 (based on UCUM code [Btu_IT])</td></tr>
  <tr><td>J</td><td>1055.05585262</td></tr>

  <tr bgcolor='gray'><td>mass</td><td>base = 'lb'</td></tr>
  <tr><td>lb</td><td> 1</td></tr>
  <tr><td>oz</td><td> 16</td></tr>
  <tr><td>ton</td><td> 1 / 2000</td></tr>
  <tr><td>kg</td><td> 0.45359237</td></tr>
  <tr><td>g</td><td> 453.59237</td></tr>
  <tr><td>T</td><td> 0.00045359237</td></tr>

  <tr bgcolor='gray'><td>ratio</td><td>base = 'ratio'</td></tr>
  <tr><td>ratio</td><td> 1</td></tr>
  <tr><td>percent</td><td> 100</td></tr>
  <tr><td>%</td><td> 100</td></tr>

  <tr bgcolor='gray'><td>temp</td><td>base = 'F'</td></tr>
  <tr><td>F</td><td> 1</td></tr>
  <tr><td>C</td><td> 5 / 9</td></tr>
  <tr><td>K</td><td> 5 / 9</td></tr>

  <tr bgcolor='gray'><td>time</td><td>base = 'min'</td></tr>
  <tr><td>min</td><td> 1</td></tr>
  <tr><td>s</td><td> 60</td></tr>
  <tr><td>h</td><td> 1 / 60</td></tr>
  <tr><td>d</td><td> 1 / (60 * 24)</td></tr>
  <tr><td>y</td><td> 1 / (60 * 24 * 365)</td></tr>

  <tr bgcolor='gray'><td>aliases</td><td>(cannot be parsed into their base units)</tr></tr>
  <tr><td>1 (=unity, i.e., 1/ft)</td><td>1</td></tr>
  <tr><td>ac (=ft2)</td><td> 1 / 43560</td></tr>
  <tr><td>ha (=ft3)</td><td> 1 / 107639</td></tr>
  <tr><td>W (=J/s)</td><td> 1 / 0.057</td></tr>
</table>

---

## Examples of Compound Units-of-Measure

By way of example, the following compound units-of-measure can be parsed:
- 'ft' (simple one-dimensional measure, simple single term)
- 'ft2'  (multi-dimensional measure, simple single term)
- 'ft3' (multi-dimensional measure, simple single term)
- 'ft/min' (simple one-dimensional numerator with simple one-dimensional denom)
- 'lb/ft3' (simple one-dimensional numerator with simple multi-dimensional denom)
- 'ft2/ft3' (simple multi-dimensional numerator with simple multi-dimensional denom)
- '1/ft'  (reduced simple multi-dimensional numerator with simple multi-dimensional denom)
- 'lb/ft2' (simple one-dimensional numerator with simple multio-dimensional denominator)
- 'ac' (an alias that cannot be parsed into its fundamental parts, in this case, 'ft2')
- 'T/ha', 'ton/ac' (single-dimensional numerator with an alias denominator)
- 'btu/ft/s' (more than 1 division)
- 'btu/ft-s' (more than 1 term in the denominator)
- 'ft-lb/min' (more than 1 term in the numerator)

---

## Rules for Constructing Units-of-measure Strings

- Only those terms in the table of [Fundamental Units-of-Measure](#uom) may be used.
- A term may be followed by '2' or '3', as in 'ft2' or 'ft3'.
- Terms may appear before and after one or more division characters ('/').
- Miltiple terms in the numerator (or denominator) must be separated by a dash ('-').
- The string may not contain any spaces or tabs.
