# Variant Classes

- AbstractVariant
  - defaultValue()
  - displayString(value)
  - displayValue(value)
  - isValid(value)

- Blob extends AbstractVariant
  - REDEFINES displayString (value) {

- Bool extends AbstractVariant
  - REDEFINES displayString (value) {

- Text extends AbstractVariant
  - ADDS _specs, _validator

- Option extends AbstractVariant
  - ADDS _specs, _validator
  - REDEFINES displayString (option)
  - ensure (option)
  - has (option)
  - options())

- Numeric extends AbstractVariant
  - ADDS _specs, _validator

- Integer extends Numeric

- Count extends Integer

- Index extends Count

- Float extends Numeric
  - setDisplayExponential (decimals)
  - setDisplayFixed (decimals)
  - setDisplayPrecision (decimals)
  - REDEFINES displayString (value)

- Quantity extends Float
  - baseAsDisplayUom (baseAmount)
  - baseAsUom (baseAmount, asUnits)
  - baseFromUom (fromAmount, fromUnits)
  - convert (fromAmount, fromUnits, intoUnits)
  - REDEFINES displayValue (baseAmount)
  - REDEFINES displayString (baseAmount)
  - setDisplayUnits (units)
  - uomKeys ()

- Slope extends Quantity
  - REDEFINES baseAsUom (baseAmount, asUnits)
  - REDEFINES baseFromUom (fromAmount, fromUnits)
  - REDEFINES convert (fromAmount, fromUnits, intoUnits)
  - REDEFINES uomKeys ()
  - static constrain (degrees)
  - static degrees (radians)
  - static radians (degrees)
  - static slopeDegrees (ratio)
  - static slopeRatio (degrees)

