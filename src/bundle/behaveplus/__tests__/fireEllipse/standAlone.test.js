/* eslint-disable no-unused-vars */
import { Bpx } from '../../Bpx.js'
import * as DagJest from '../../../../utils/matchers.js'
import * as SurfaceFire from '../../equations/SurfaceFire.js'
import { configDefault } from '../testData.js'

const value = DagJest.value
expect.extend({ value })

const dag = new Bpx()
dag.runConfigs(configDefault)
dag.runConfigs([
  ['link.fireEllipse', 'standAlone'],
  ['configure.fire.firelineIntensity', 'firelineIntensity'],
  ['configure.fire.lengthToWidthRatio', 'lengthToWidthRatio']
])
const headRos = dag.get('surface.fire.ellipse.head.spreadRate')
const headFli = dag.get('surface.fire.ellipse.head.firelineIntensity')
const headFl = dag.get('surface.fire.ellipse.head.flameLength')
const axisLwr = dag.get('surface.fire.ellipse.axis.lengthToWidthRatio')
const axisEws = dag.get('surface.fire.ellipse.axis.effectiveWindSpeed')

const observedRos = dag.get('site.fire.observed.spreadRate')
const observedFli = dag.get('site.fire.observed.firelineIntensity')
const observedFl = dag.get('site.fire.observed.flameLength')
const observedLwr = dag.get('site.fire.observed.lengthToWidthRatio')
const observedEws = dag.get('site.fire.observed.effectiveWindSpeed')

test('1: Head ros', () => {
  // Start with selecting just the head fire spread rate
  dag.clearSelected()
  dag.runConfigs([
    ['link.fireEllipse', 'standAlone'],
    ['configure.fire.firelineIntensity', 'firelineIntensity'],
    ['configure.fire.lengthToWidthRatio', 'lengthToWidthRatio']
  ])
  dag.runSelected([[headRos, true]])
  const selectedNodes = dag.selectedNodes()
  expect(selectedNodes).toContain(headRos)
  // head.spreadRate should be bound to site.fire.observed.spreadRate
  let inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(1)
  expect(inputNodes).toContain(observedRos)
  // Set the site.fire.observed.spreadRate and ensure it is passed on
  dag.runInputs([[observedRos, 10]])
  expect(observedRos.value).toEqual(10)
  expect(headRos.value).toEqual(10)

  // Link back to surfaceFire
  dag.runConfigs([
    ['link.fireEllipse', 'linkedToSurfaceFire']
  ])
  // Now head.spreadRate is bound to surface.weighted.fire.spreadRate
  inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(12)
  expect(headRos.update.args[0]).toEqual(dag.get('surface.weighted.fire.spreadRate'))

  // Back to standAlone
  dag.runConfigs([['link.fireEllipse', 'standAlone']])
  // head.spreadRate should be bound to site.fire.observed.spreadRate
  inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(1)
  expect(inputNodes).toContain(observedRos)
})

test('2.1: input fire.observed.firelineIntensity, select head.firelineIntensity', () => {
  dag.clearSelected()
  dag.runConfigs([
    ['link.fireEllipse', 'standAlone'],
    ['configure.fire.firelineIntensity', 'firelineIntensity']
  ])

  // Select just head.firelineIntensity
  dag.runSelected([[headFli, true]])
  const selectedNodes = dag.selectedNodes()
  expect(selectedNodes.length).toEqual(1)
  expect(selectedNodes).toContain(headFli)

  // Input is just fire.observed.firelineIntensity
  const inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(1)
  expect(inputNodes).toContain(observedFli)
  dag.runInputs([[observedFli, 5000]])

  // observed.firelineIntensity -> head.firelineIntensity
  const requiredUpdateNodes = dag.requiredUpdateNodes()
  expect(requiredUpdateNodes.length).toEqual(2)
  expect(requiredUpdateNodes).toContain(observedFli) // input
  expect(requiredUpdateNodes).toContain(headFli) // output

  // Results
  expect(observedFli.value).toEqual(5000)
  expect(headFli.value).toEqual(observedFli.value)
  expect(headFli.value).toEqual(5000)
})

test('2.2: input fire.observed.firelineIntensity, select axis.flameLength', () => {
  dag.clearSelected()
  dag.runConfigs([
    ['link.fireEllipse', 'standAlone'],
    ['configure.fire.firelineIntensity', 'firelineIntensity']
  ])

  // Select just head.flameLength
  dag.runSelected([[headFl, true]])
  const selectedNodes = dag.selectedNodes()
  expect(selectedNodes.length).toEqual(1)
  expect(selectedNodes).toContain(headFl)

  // Input is just fire.observed.firelineIntensity
  const inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(1)
  expect(inputNodes).toContain(observedFli)
  dag.runInputs([[observedFli, 5000]])

  // observed.firelineIntensity -> observed.flameLength -> head.flameLength
  const requiredUpdateNodes = dag.requiredUpdateNodes()
  expect(requiredUpdateNodes.length).toEqual(3)
  expect(requiredUpdateNodes).toContain(observedFli) // input
  expect(requiredUpdateNodes).toContain(observedFl) // intermediate
  expect(requiredUpdateNodes).toContain(headFl) // output

  // Results
  expect(observedFli.value).toEqual(5000)
  expect(observedFl.value).toEqual(SurfaceFire.flameLength(5000))
  expect(headFl.value).toEqual(observedFl.value)
  expect(headFl.value).toEqual(SurfaceFire.flameLength(5000))
})

test('2.3: input fire.observed.firelineIntensity, select both head.fli and head.fl', () => {
  dag.clearSelected()
  dag.runConfigs([
    ['link.fireEllipse', 'standAlone'],
    ['configure.fire.firelineIntensity', 'firelineIntensity']
  ])

  // Select both head.firelineIntensity and head.flameLength
  dag.runSelected([
    [headFli, true],
    [headFl, true]
  ])
  const selectedNodes = dag.selectedNodes()
  expect(selectedNodes.length).toEqual(2)
  expect(selectedNodes).toContain(headFli)
  expect(selectedNodes).toContain(headFl)

  // Input is just fire.observed.lengthToWIdthratio
  const inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(1)
  expect(inputNodes).toContain(observedFli)
  dag.runInputs([[observedFli, 4000]])

  // observed.firelineIntensity +-> head.firelineIntensity
  //                            +-> observed.flameLength -> head.flameLength
  const requiredUpdateNodes = dag.requiredUpdateNodes()
  expect(requiredUpdateNodes.length).toEqual(4)
  expect(requiredUpdateNodes).toContain(observedFli) // input
  expect(requiredUpdateNodes).toContain(observedFl) // intermediate
  expect(requiredUpdateNodes).toContain(headFli) // output
  expect(requiredUpdateNodes).toContain(headFl) // output

  // Results
  expect(observedFli.value).toEqual(4000)
  expect(headFli.value).toEqual(observedFli.value)
  expect(observedFl.value).toEqual(SurfaceFire.flameLength(4000))
  expect(headFli.value).toEqual(4000)
  expect(headFl.value).toEqual(SurfaceFire.flameLength(4000))
})

test('2.4: input fire.observed.flameLength, select head.firelineIntensity', () => {
  dag.clearSelected()
  dag.runConfigs([
    ['link.fireEllipse', 'standAlone'],
    ['configure.fire.firelineIntensity', 'flameLength']
  ])

  // Select just head.firelineIntensity
  dag.runSelected([[headFli, true]])
  const selectedNodes = dag.selectedNodes()
  expect(selectedNodes.length).toEqual(1)
  expect(selectedNodes).toContain(headFli)

  // Input is just fire.observed.flameLength
  const inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(1)
  expect(inputNodes).toContain(observedFl)
  dag.runInputs([[observedFl, 10]])

  // observed.flameLength -> observed.firelineIntensity -> head.firelineIntensity
  const requiredUpdateNodes = dag.requiredUpdateNodes()
  expect(requiredUpdateNodes.length).toEqual(3)
  expect(requiredUpdateNodes).toContain(observedFl) // input
  expect(requiredUpdateNodes).toContain(observedFli) // intermediate
  expect(requiredUpdateNodes).toContain(headFli) // output

  // Results
  expect(observedFl.value).toEqual(10)
  expect(observedFli.value).toEqual(SurfaceFire.firelineIntensityFromFlameLength(10))
  expect(headFli.value).toEqual(observedFli.value)
  expect(headFli.value).toEqual(SurfaceFire.firelineIntensityFromFlameLength(10))
})

test('2.5: input fire.observed.flameLength, select head.flameLength', () => {
  dag.clearSelected()
  dag.runConfigs([
    ['link.fireEllipse', 'standAlone'],
    ['configure.fire.firelineIntensity', 'flameLength']
  ])

  // Select just head.flameLength
  dag.runSelected([[headFl, true]])
  const selectedNodes = dag.selectedNodes()
  expect(selectedNodes.length).toEqual(1)
  expect(selectedNodes).toContain(headFl)

  // Input is just fire.observed.flameLength
  const inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(1)
  expect(inputNodes).toContain(observedFl)
  dag.runInputs([[observedFl, 20]])

  // observed.flameLength -> head.flameLength
  const requiredUpdateNodes = dag.requiredUpdateNodes()
  expect(requiredUpdateNodes.length).toEqual(2)
  expect(requiredUpdateNodes).toContain(observedFl) // input
  expect(requiredUpdateNodes).not.toContain(observedFli) // intermediate
  expect(requiredUpdateNodes).toContain(headFl) // output

  // Results
  expect(observedFl.value).toEqual(20)
  expect(headFl.value).toEqual(observedFl.value)
  expect(headFl.value).toEqual(20)
})

test('2.6: input fire.observed.flameLength, select both head.fli and head.fl', () => {
  dag.clearSelected()
  dag.runConfigs([
    ['link.fireEllipse', 'standAlone'],
    ['configure.fire.firelineIntensity', 'flameLength']
  ])

  // Select both head.firelineIntensity and head.flameLength
  dag.runSelected([
    [headFli, true],
    [headFl, true]
  ])
  const selectedNodes = dag.selectedNodes()
  expect(selectedNodes.length).toEqual(2)
  expect(selectedNodes).toContain(headFli)
  expect(selectedNodes).toContain(headFl)

  // Input is just fire.observed.flameLength
  const inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(1)
  expect(inputNodes).toContain(observedFl)
  dag.runInputs([[observedFl, 30]])

  // observed.flameLength +-> head.flameLength
  //                      +-> observed.firelineIntensity -> head.firelineIntensity
  const requiredUpdateNodes = dag.requiredUpdateNodes()
  expect(requiredUpdateNodes.length).toEqual(4)
  expect(requiredUpdateNodes).toContain(observedFl) // input
  expect(requiredUpdateNodes).toContain(observedFli) // intermediate
  expect(requiredUpdateNodes).toContain(headFli) // output
  expect(requiredUpdateNodes).toContain(headFl) // output

  // Results
  expect(observedFl.value).toEqual(30)
  expect(headFl.value).toEqual(observedFl.value)
  expect(headFl.value).toEqual(30)
  expect(observedFli.value).toEqual(
    SurfaceFire.firelineIntensityFromFlameLength(30)
  )
  expect(headFli.value).toEqual(observedFli.value)
  expect(headFli.value).toEqual(
    SurfaceFire.firelineIntensityFromFlameLength(30)
  )
})

test('3.1: input fire.observed.lengthToWidthRatio, select axis.lengthToWidthRatio', () => {
  dag.clearSelected()
  dag.runConfigs([
    ['link.fireEllipse', 'standAlone'],
    ['configure.fire.lengthToWidthRatio', 'lengthToWidthRatio']
  ])

  // Select just axis.lengthToWidthRatio
  dag.runSelected([[axisLwr, true]])
  const selectedNodes = dag.selectedNodes()
  expect(selectedNodes.length).toEqual(1)
  expect(selectedNodes).toContain(axisLwr)

  // Input is just fire.observed.lengthToWidthRatio
  const inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(1)
  expect(inputNodes).toContain(observedLwr)
  dag.runInputs([[observedLwr, 3]])

  // observed.lengthToWidthRatio -> axis.lengthToWidthRatio
  const requiredUpdateNodes = dag.requiredUpdateNodes()
  expect(requiredUpdateNodes.length).toEqual(2)
  expect(requiredUpdateNodes).toContain(observedLwr) // input
  expect(requiredUpdateNodes).toContain(axisLwr) // output

  // Results
  expect(observedLwr.value).toEqual(3)
  expect(axisLwr.value).toEqual(observedLwr.value)
  expect(axisLwr.value).toEqual(3)
})

test('3.2: input fire.observed.lengthToWidthRatio, select axis.effectiveWindSpeed', () => {
  dag.clearSelected()
  dag.runConfigs([
    ['link.fireEllipse', 'standAlone'],
    ['configure.fire.lengthToWidthRatio', 'lengthToWidthRatio']
  ])

  // Select just axis.effectiveWindSpeed
  dag.runSelected([[axisEws, true]])
  const selectedNodes = dag.selectedNodes()
  expect(selectedNodes.length).toEqual(1)
  expect(selectedNodes).toContain(axisEws)

  // Input is just fire.observed.lengthToWidthRatio
  const inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(1)
  expect(inputNodes).toContain(observedLwr)
  dag.runInputs([[observedLwr, 3]])

  // observed.lengthToWidthRatio -> observed.effectiveWindSpeed -> axis.effectiveWindSpeed
  const requiredUpdateNodes = dag.requiredUpdateNodes()
  expect(requiredUpdateNodes.length).toEqual(3)
  expect(requiredUpdateNodes).toContain(observedLwr) // input
  expect(requiredUpdateNodes).toContain(observedEws) // intermediate
  expect(requiredUpdateNodes).toContain(axisEws) // output

  // Results
  expect(observedEws.value).toEqual(88 * 4 * (3 - 1))
  expect(axisEws.value).toEqual(observedEws.value)
  expect(axisEws.value).toEqual(88 * 4 * (3 - 1))
})

test('3.3: input fire.observed.lengthToWidthRatio, select both axis.lwr and axis.ews', () => {
  dag.clearSelected()
  dag.runConfigs([
    ['link.fireEllipse', 'standAlone'],
    ['configure.fire.lengthToWidthRatio', 'lengthToWidthRatio']
  ])

  // Select both axis.lengthToWidthRatio and axis.effectiveWindSpeed
  dag.runSelected([
    [axisLwr, true],
    [axisEws, true]
  ])
  const selectedNodes = dag.selectedNodes()
  expect(selectedNodes.length).toEqual(2)
  expect(selectedNodes).toContain(axisEws)
  expect(selectedNodes).toContain(axisLwr)

  // Input is just fire.observed.lengthToWIdthratio
  const inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(1)
  expect(inputNodes).toContain(observedLwr)
  dag.runInputs([[observedLwr, 3]])

  // observed.lengthToWidthRatio +-> axis.lengthToWIdthRatio
  //                             +-> observed.effectiveWindSpeed -> axis.effectiveWindSpeed
  const requiredUpdateNodes = dag.requiredUpdateNodes()
  expect(requiredUpdateNodes.length).toEqual(4)
  expect(requiredUpdateNodes).toContain(observedLwr) // input
  expect(requiredUpdateNodes).toContain(observedEws) // intermediate
  expect(requiredUpdateNodes).toContain(axisEws) // output
  expect(requiredUpdateNodes).toContain(axisLwr) // output

  // Results
  expect(observedEws.value).toEqual(88 * 4 * (3 - 1))
  expect(axisEws.value).toEqual(observedEws.value)
  expect(axisEws.value).toEqual(88 * 4 * (3 - 1))
  expect(axisLwr.value).toEqual(3)
  expect(axisLwr.value).toEqual(observedLwr.value)
})

test('3.4: input fire.observed.effectiveWindSpeed, select axis.lengthToWidthRatio', () => {
  dag.clearSelected()
  dag.runConfigs([
    ['link.fireEllipse', 'standAlone'],
    ['configure.fire.lengthToWidthRatio', 'effectiveWindSpeed']
  ])

  // Select just axis.lengthToWidthRatio
  dag.runSelected([[axisLwr, true]])
  const selectedNodes = dag.selectedNodes()
  expect(selectedNodes.length).toEqual(1)
  expect(selectedNodes).toContain(axisLwr)

  // Input is just fire.observed.effectiveWindSpeed
  const inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(1)
  expect(inputNodes).toContain(observedEws)
  dag.runInputs([[observedEws, 880]])

  // observed.effectiveWindSpeed -> observed.lengthToWidthRatio -> axis.lengthToWidthRatio
  const requiredUpdateNodes = dag.requiredUpdateNodes()
  expect(requiredUpdateNodes.length).toEqual(3)
  expect(requiredUpdateNodes).toContain(observedEws) // input
  expect(requiredUpdateNodes).toContain(observedLwr) // intermediate
  expect(requiredUpdateNodes).toContain(axisLwr) // output

  // Results
  expect(observedEws.value).toEqual(880)
  expect(observedLwr.value).toEqual(3.5)
  expect(axisLwr.value).toEqual(observedLwr.value)
  expect(axisLwr.value).toEqual(3.5)
})

test('3.5: input fire.observed.effectiveWindSpeed, select axis.effectiveWindSpeed', () => {
  dag.clearSelected()
  dag.runConfigs([
    ['link.fireEllipse', 'standAlone'],
    ['configure.fire.lengthToWidthRatio', 'effectiveWindSpeed']
  ])

  // Select just axis.effectiveWindSpeed
  dag.runSelected([[axisEws, true]])
  const selectedNodes = dag.selectedNodes()
  expect(selectedNodes.length).toEqual(1)
  expect(selectedNodes).toContain(axisEws)

  // Input is just fire.observed.effectiveWindSpeed
  const inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(1)
  expect(inputNodes).toContain(observedEws)
  dag.runInputs([[observedEws, 880]])

  // observed.effectiveWindSpeed -> axis.effectiveWindSpeed
  const requiredUpdateNodes = dag.requiredUpdateNodes()
  expect(requiredUpdateNodes.length).toEqual(2)
  expect(requiredUpdateNodes).toContain(observedEws) // input
  expect(requiredUpdateNodes).not.toContain(observedLwr) // intermediate
  expect(requiredUpdateNodes).toContain(axisEws) // output

  // Results
  expect(observedEws.value).toEqual(880)
  expect(axisEws.value).toEqual(observedEws.value)
  expect(axisEws.value).toEqual(880)
})

test('3.6: input fire.observed.effectiveWindSpeed, select both axis.ews and axis.lwr', () => {
  dag.clearSelected()
  dag.runConfigs([
    ['link.fireEllipse', 'standAlone'],
    ['configure.fire.lengthToWidthRatio', 'effectiveWindSpeed']
  ])

  // Select both axis.effectiveWindSpeed and axis.lengthToWidthRatio
  dag.runSelected([
    [axisEws, true],
    [axisLwr, true]
  ])
  const selectedNodes = dag.selectedNodes()
  expect(selectedNodes.length).toEqual(2)
  expect(selectedNodes).toContain(axisEws)
  expect(selectedNodes).toContain(axisLwr)

  // Input is just fire.observed.effectiveWindSpeed
  const inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(1)
  expect(inputNodes).toContain(observedEws)
  dag.runInputs([[observedEws, 880]])

  // observed.effectiveWindSpeed +-> axis.effectiveWindSpeed
  //                             +-> observed.lengthToWidthRatio -> axis.lengthToWIdthRatio
  const requiredUpdateNodes = dag.requiredUpdateNodes()
  expect(requiredUpdateNodes.length).toEqual(4)
  expect(requiredUpdateNodes).toContain(observedEws) // input
  expect(requiredUpdateNodes).toContain(observedLwr) // intermediate
  expect(requiredUpdateNodes).toContain(axisEws) // output
  expect(requiredUpdateNodes).toContain(axisLwr) // output

  // Results
  expect(observedEws.value).toEqual(880)
  expect(axisEws.value).toEqual(observedEws.value)
  expect(axisEws.value).toEqual(880)
  expect(observedLwr.value).toEqual(3.5)
  expect(axisLwr.value).toEqual(observedLwr.value)
  expect(axisLwr.value).toEqual(3.5)
})
