/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
const request = require('request')

/**
 * http://unitsofmeasure.org/ucum.html
 */
function ucum (units) {
  const urlBase = 'https://ucum.nlm.nih.gov/ucum-service/v1/ucumtransform/1'
  units.forEach(unit => {
    const base = encodeURIComponent(units[0])
    const into = encodeURIComponent(unit)
    const url = `${urlBase}/from/${base}/to/${into}`
    const options = { url: url, json: true }
    request(options, callback)
  })
}

function callback (err, response, body) {
  if (err) {
    console.log('error:', err)
  } else {
    // console.log(body)
    const r = body.UCUMWebServiceResponse.Response
    // const a1 = r.SourceQuantity
    // const a2 = r.SourceUnit
    const b1 = r.ResultQuantity
    const b2 = r.TargetUnit
    // console.log(`${a1} ${a2} = ${b1} ${b2} (or 1/${1 / b1})`)
    console.log(`${b2}: ${b1}, // or 1 / ${1 / b1}`)
  }
}

function area () {
  ucum([
    '[ft_i]2', '[in_i]2', '[yd_i]2', '[mi_i]2', '[acr_us]', '[sft_i]',
    'm2', 'cm2', 'km2', 'har'])
}

function density () {}

function distance_i () {
  ucum([
    '[ft_i]', '[in_i]', '[yd_i]', '[mi_i]', '[ch_us]',
    'm', 'cm', 'km'
  ])
}

function distance_us () {
  ucum([
    '[ft_us]', '[in_us]', '[yd_us]', '[mi_us]', '[ch_us]',
    'm', 'cm', 'km'
  ])
}

function energy () {
  // ucum(['J', ['[Btu_th]', '[Btu]', '[Btu-39]', '[Btu_59]', '[Btu_60]', '[Btu_m]'])
  ucum([
    '[Btu_th]',
    'kJ', 'J'
  ])
}

function load () {
  ucum([
    '[lb_av]/[ft_i]2', '[ston_av]/[acr_us]',
    'kg/m2', 't/har'
  ])
}

function mass () {
  ucum([
    '[lb_av]', '[oz_av]', '[ston_av]',
    'kg', 't'])
}

function power () {
  ucum([
    '[Btu_th]/min', '[Btu_th]/s', '[ft_i].[lb_av]/s',
    'W', 'J/s', 'J/min'
  ])
}

function temperature () {
  ucum(['[degF]', 'Cel', 'K'])
}

function time () {}

function volume () {
  ucum([
    '[ft_i]3', '[in_i]3', '[yd_i]3', '[mi_i]3', '[bf_i]',
    'm3', 'cm3', 'L'])
}

// mass()
// ucum(['[lb_av]/[ft_i]2', '[ston_av]/[acr_us]'])
distance_i()
// ucum(['[ft_i]2', '[acr_us]', 'har'])
