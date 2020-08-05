import * as SF from '../SurfaceFire.js'
import * as FE from '../FireEllipse.js'

test('SurfaceFire.spreadRateWithRosLimitApplied()', () => {
  expect(SF.spreadRateWithRosLimitApplied(100, 880)).toEqual(100)
  expect(SF.spreadRateWithRosLimitApplied(100, 90)).toEqual(90)
  expect(SF.spreadRateWithRosLimitApplied(100, 80)).toEqual(100)
})

test('SurfaceFire.phiEffectiveWind()', () => {
  expect(SF.phiEffectiveWind(1, 2)).toEqual(3)
})

test('SurfaceFire.spreadDirectionFromUpslope()', () => {
  const comp = [-1, 0, 1]
  const pi = Math.PI
  comp.forEach(xComp => {
    comp.forEach(yComp => {
      ;[0, Math.PI / 2, Math.PI, -Math.PI].forEach(rosv => {
        const al = rosv <= 0 ? 0 : Math.asin(Math.abs(yComp) / rosv)
        const rad =
          xComp >= 0
            ? yComp >= 0
              ? al
              : pi + pi - al
            : yComp >= 0
              ? pi - al
              : pi + al
        const deg = (rad * 180) / Math.PI
        // console.log(`${xComp},${yComp},${rosv}: ${al}, ${rad}, ${deg}`)
        expect(SF.spreadDirectionFromUpslope(xComp, yComp, rosv)).toEqual(deg)
      })
    })
  })
})

test('FireEllipse.betaSpreadRate (betaHead, rosHead, eccent) ', () => {
  const betaHead = 0
  const rosHead = 10
  const eccent = 2
  expect(FE.betaSpreadRate(betaHead, rosHead, eccent)).toEqual(rosHead)
})
