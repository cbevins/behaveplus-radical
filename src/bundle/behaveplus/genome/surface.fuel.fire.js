export function slopeRatio (prefix) {
  return prefix === 'crown.canopy.fuel'
    ? [
        `${prefix}.fire.slope.ratio`,
        [['SlopeSteepness'], [['finally', 'Dag.fixed', 0]]]
    ]
    : [
        `${prefix}.fire.slope.ratio`,
        [
          ['SlopeSteepness'],
          [['finally', 'Dag.bind', 'site.slope.steepness.ratio']]
        ]
    ]
}

export function windHeadingFromUpslope (prefix) {
  return prefix === 'crown.canopy.fuel'
    ? [
        `${prefix}.fire.wind.heading.fromUpslope`,
        [['CompassAzimuth'], [['finally', 'Dag.fixed', 0]]]
    ]
    : [
        `${prefix}.fire.wind.heading.fromUpslope`,
        [
          ['CompassAzimuth'],
          [['finally', 'Dag.bind', 'site.wind.direction.heading.fromUpslope']]
        ]
    ]
}

export function windSpeedAdjustmentFactor (prefix) {
  return prefix === 'crown.canopy.fuel'
    ? [
        `${prefix}.fire.windSpeedAdjustmentFactor`,
        [
          ['WindSpeedAdjustmentFactor'],
          [['finally', 'Dag.fixed', 0.4]]
        ]
    ]
    : [
        `${prefix}.fire.windSpeedAdjustmentFactor`,
        [
          ['WindSpeedAdjustmentFactor'],
          [
            [
              'when',
              'configure.fuel.windSpeedAdjustmentFactor',
              'equals',
              'input',
              'Dag.bind',
              'site.windSpeedAdjustmentFactor'
            ],
            [
              'finally',
              'FuelBed.windSpeedAdjustmentFactor',
              'site.canopy.fuel.isSheltered',
              'site.canopy.sheltered.windSpeedAdjustmentFactor',
              `${prefix}.bed.open.windSpeedAdjustmentFactor`
            ]
          ]
        ]
    ]
}

export function genome (prefix) {
  return [
    [
      `${prefix}.fire.maximumDirection.slope.spreadRate`,
      [
        ['FireSpreadRate'],
        [
          [
            'finally',
            'SurfaceFire.maximumDirectionSlopeSpreadRate',
            `${prefix}.fire.noWindNoSlope.spreadRate`,
            `${prefix}.fire.slope.phi`
          ]
        ]
      ]
    ],
    [
      `${prefix}.fire.maximumDirection.wind.spreadRate`,
      [
        ['FireSpreadRate'],
        [
          [
            'finally',
            'SurfaceFire.maximumDirectionWindSpreadRate',
            `${prefix}.fire.noWindNoSlope.spreadRate`,
            `${prefix}.fire.wind.phi`
          ]
        ]
      ]
    ],
    windHeadingFromUpslope(prefix),
    [
      `${prefix}.fire.maximumDirection.xComponent`,
      [
        ['Factor'],
        [
          [
            'finally',
            'SurfaceFire.maximumDirectionXComponent',
            `${prefix}.fire.maximumDirection.wind.spreadRate`,
            `${prefix}.fire.maximumDirection.slope.spreadRate`,
            `${prefix}.fire.wind.heading.fromUpslope`
          ]
        ]
      ]
    ],
    [
      `${prefix}.fire.maximumDirection.yComponent`,
      [
        ['Factor'],
        [
          [
            'finally',
            'SurfaceFire.maximumDirectionYComponent',
            `${prefix}.fire.maximumDirection.wind.spreadRate`,
            `${prefix}.fire.wind.heading.fromUpslope`
          ]
        ]
      ]
    ],
    [
      `${prefix}.fire.maximumDirection.spreadRate`,
      [
        ['FireSpreadRate'],
        [
          [
            'finally',
            'SurfaceFire.maximumDirectionSpreadRate',
            `${prefix}.fire.maximumDirection.xComponent`,
            `${prefix}.fire.maximumDirection.yComponent`
          ]
        ]
      ]
    ],
    // end `${prefix}.fire.maximumDirection`
    [
      `${prefix}.fire.limit.effectiveWindSpeed.exceeded`,
      [
        ['Bool'],
        [
          [
            'finally',
            'Calc.greaterThan',
            `${prefix}.fire.spread.step2.effectiveWindSpeed`,
            `${prefix}.fire.limit.effectiveWindSpeed`
          ]
        ]
      ]
    ],
    [
      `${prefix}.fire.limit.spreadRate.exceeded`,
      [
        ['Bool'],
        [
          [
            'finally',
            'Calc.greaterThan',
            `${prefix}.fire.spread.step2.spreadRate`,
            `${prefix}.fire.spread.step3b.spreadRate`
          ]
        ]
      ]
    ],
    // end `${prefix}.fire.exceeded`
    [
      `${prefix}.fire.limit.effectiveWindSpeed`,
      [
        ['WindSpeed'],
        [
          [
            'finally',
            'SurfaceFire.effectiveWindSpeedLimit',
            `${prefix}.fire.reactionIntensity`
          ]
        ]
      ]
    ],
    [
      `${prefix}.fire.limit.windSlopeSpreadRateCoefficient`,
      [
        ['Factor'],
        [
          [
            'finally',
            'SurfaceFire.phiEwFromEws',
            `${prefix}.fire.limit.effectiveWindSpeed`,
            `${prefix}.fire.wind.factor.b`,
            `${prefix}.fire.wind.factor.k`
          ]
        ]
      ]
    ],
    [
      `${prefix}.fire.limit.spreadRate`,
      [
        ['FireSpreadRate'],
        [
          [
            'finally',
            'SurfaceFire.maximumSpreadRate',
            `${prefix}.fire.noWindNoSlope.spreadRate`,
            `${prefix}.fire.limit.windSlopeSpreadRateCoefficient`
          ]
        ]
      ]
    ],
    // end `${prefix}.fire.limit`
    slopeRatio(prefix),
    [
      `${prefix}.fire.slope.k`,
      [
        ['Factor'],
        [['finally', 'FuelBed.slopeK', `${prefix}.bed.packingRatio`]]
      ]
    ],
    [
      `${prefix}.fire.slope.phi`,
      [
        ['Factor'],
        [
          [
            'finally',
            'SurfaceFire.phiSlope',
            `${prefix}.fire.slope.ratio`,
            `${prefix}.fire.slope.k`
          ]
        ]
      ]
    ],
    // end `${prefix}.fire.slope`
    [
      `${prefix}.fire.spread.step1.effectiveWindSpeed`,
      [
        ['WindSpeed'],
        [
          [
            'finally',
            'SurfaceFire.effectiveWindSpeed',
            `${prefix}.fire.spread.step1.phiEffectiveWind`,
            `${prefix}.fire.wind.factor.b`,
            `${prefix}.fire.wind.factor.i`
          ]
        ]
      ]
    ],
    [
      `${prefix}.fire.spread.step1.phiEffectiveWind`,
      [
        ['Factor'],
        [
          [
            'finally',
            'SurfaceFire.phiEffectiveWind',
            `${prefix}.fire.wind.phi`,
            `${prefix}.fire.slope.phi`
          ]
        ]
      ]
    ],
    [
      `${prefix}.fire.spread.step1.spreadRate`,
      [
        ['FireSpreadRate'],
        [
          [
            'finally',
            'SurfaceFire.maximumSpreadRate',
            `${prefix}.fire.noWindNoSlope.spreadRate`,
            `${prefix}.fire.spread.step1.phiEffectiveWind`
          ]
        ]
      ]
    ],
    // end `${prefix}.fire.spread.step1`
    [
      `${prefix}.fire.spread.step2.effectiveWindSpeed`,
      [
        ['WindSpeed'],
        [
          [
            'finally',
            'SurfaceFire.effectiveWindSpeed',
            `${prefix}.fire.spread.step2.phiEffectiveWind`,
            `${prefix}.fire.wind.factor.b`,
            `${prefix}.fire.wind.factor.i`
          ]
        ]
      ]
    ],
    [
      `${prefix}.fire.spread.step2.phiEffectiveWind`,
      [
        ['Factor'],
        [
          [
            'finally',
            'SurfaceFire.phiEffectiveWindInferred',
            `${prefix}.fire.noWindNoSlope.spreadRate`,
            `${prefix}.fire.spread.step2.spreadRate`
          ]
        ]
      ]
    ],
    [
      `${prefix}.fire.spread.step2.spreadRate`,
      [
        ['FireSpreadRate'],
        [
          [
            'finally',
            'SurfaceFire.spreadRateWithCrossSlopeWind',
            `${prefix}.fire.noWindNoSlope.spreadRate`,
            `${prefix}.fire.maximumDirection.spreadRate`
          ]
        ]
      ]
    ],
    // end `${prefix}.fire.spread.step2`
    [
      `${prefix}.fire.spread.step3a.effectiveWindSpeed`,
      [
        ['WindSpeed'],
        [
          [
            'finally',
            'Math.min',
            `${prefix}.fire.spread.step2.effectiveWindSpeed`,
            `${prefix}.fire.limit.effectiveWindSpeed`
          ]
        ]
      ]
    ],
    [
      `${prefix}.fire.spread.step3a.phiEffectiveWind`,
      [
        ['Factor'],
        [
          [
            'finally',
            'Math.min',
            `${prefix}.fire.spread.step2.phiEffectiveWind`,
            `${prefix}.fire.limit.windSlopeSpreadRateCoefficient`
          ]
        ]
      ]
    ],
    [
      `${prefix}.fire.spread.step3a.spreadRate`,
      [
        ['FireSpreadRate'],
        [
          [
            'finally',
            'Math.min',
            `${prefix}.fire.spread.step2.spreadRate`,
            `${prefix}.fire.limit.spreadRate`
          ]
        ]
      ]
    ],
    // end `${prefix}.fire.spread.step3a`
    [
      `${prefix}.fire.spread.step3b.effectiveWindSpeed`,
      [
        ['WindSpeed'],
        [
          [
            'finally',
            'SurfaceFire.effectiveWindSpeed',
            `${prefix}.fire.spread.step3b.phiEffectiveWind`,
            `${prefix}.fire.wind.factor.b`,
            `${prefix}.fire.wind.factor.i`
          ]
        ]
      ]
    ],
    [
      `${prefix}.fire.spread.step3b.phiEffectiveWind`,
      [
        ['Factor'],
        [
          [
            'finally',
            'SurfaceFire.phiEffectiveWindInferred',
            `${prefix}.fire.noWindNoSlope.spreadRate`,
            `${prefix}.fire.spread.step3b.spreadRate`
          ]
        ]
      ]
    ],
    [
      `${prefix}.fire.spread.step3b.spreadRate`,
      [
        ['FireSpreadRate'],
        [
          [
            'finally',
            'SurfaceFire.spreadRateWithRosLimitApplied',
            `${prefix}.fire.spread.step2.spreadRate`,
            `${prefix}.fire.spread.step2.effectiveWindSpeed`
          ]
        ]
      ]
    ],
    // end `${prefix}.fire.spread.step3b`
    [
      `${prefix}.fire.spread.step4.effectiveWindSpeed`,
      [
        ['WindSpeed'],
        [
          [
            'finally',
            'SurfaceFire.effectiveWindSpeed',
            `${prefix}.fire.spread.step4.phiEffectiveWind`,
            `${prefix}.fire.wind.factor.b`,
            `${prefix}.fire.wind.factor.i`
          ]
        ]
      ]
    ],
    [
      `${prefix}.fire.spread.step4.phiEffectiveWind`,
      [
        ['Factor'],
        [
          [
            'finally',
            'SurfaceFire.phiEffectiveWindInferred',
            `${prefix}.fire.noWindNoSlope.spreadRate`,
            `${prefix}.fire.spread.step4.spreadRate`
          ]
        ]
      ]
    ],
    [
      `${prefix}.fire.spread.step4.spreadRate`,
      [
        ['FireSpreadRate'],
        [
          [
            'finally',
            'SurfaceFire.spreadRateWithRosLimitApplied',
            `${prefix}.fire.spread.step3a.spreadRate`,
            `${prefix}.fire.spread.step3a.effectiveWindSpeed`
          ]
        ]
      ]
    ],
    // end `${prefix}.fire.spread.step4`
    // end `${prefix}.fire.spread`
    windSpeedAdjustmentFactor(prefix),
    [
      `${prefix}.fire.wind.speed.atMidflame`,
      [
        ['WindSpeed'],
        [
          [
            'when',
            'configure.wind.speed',
            'equals',
            'atMidflame',
            'Dag.bind',
            'site.wind.speed.atMidflame'
          ],
          [
            'finally',
            'Wind.speedAtMidflame',
            'site.wind.speed.at20ft',
            `${prefix}.fire.windSpeedAdjustmentFactor`
          ]
        ]
      ]
    ],
    [
      `${prefix}.fire.wind.factor.b`,
      [
        ['Factor'],
        [['finally', 'FuelBed.windB', `${prefix}.bed.surfaceAreaToVolumeRatio`]]
      ]
    ],
    [
      `${prefix}.fire.wind.factor.c`,
      [
        ['Factor'],
        [['finally', 'FuelBed.windC', `${prefix}.bed.surfaceAreaToVolumeRatio`]]
      ]
    ],
    [
      `${prefix}.fire.wind.factor.e`,
      [
        ['Factor'],
        [['finally', 'FuelBed.windE', `${prefix}.bed.surfaceAreaToVolumeRatio`]]
      ]
    ],
    [
      `${prefix}.fire.wind.factor.k`,
      [
        ['Factor'],
        [
          [
            'finally',
            'FuelBed.windK',
            `${prefix}.bed.packingRatio.ratio`,
            `${prefix}.fire.wind.factor.e`,
            `${prefix}.fire.wind.factor.c`
          ]
        ]
      ]
    ],
    [
      `${prefix}.fire.wind.factor.i`,
      [
        ['Factor'],
        [
          [
            'finally',
            'FuelBed.windI',
            `${prefix}.bed.packingRatio.ratio`,
            `${prefix}.fire.wind.factor.e`,
            `${prefix}.fire.wind.factor.c`
          ]
        ]
      ]
    ],
    [
      `${prefix}.fire.wind.phi`,
      [
        ['Factor'],
        [
          [
            'finally',
            'SurfaceFire.phiWind',
            `${prefix}.fire.wind.speed.atMidflame`,
            `${prefix}.fire.wind.factor.b`,
            `${prefix}.fire.wind.factor.k`
          ]
        ]
      ]
    ],
    // end `${prefix}.fire.wind`
    [
      `${prefix}.fire.effectiveWindSpeed`,
      [
        ['WindSpeed'],
        [
          [
            'when',
            'configure.fire.effectiveWindSpeedLimit',
            'equals',
            'applied',
            'Dag.bind',
            `${prefix}.fire.spread.step4.effectiveWindSpeed`
          ],
          [
            'finally',
            'Dag.bind',
            `${prefix}.fire.spread.step3b.effectiveWindSpeed`
          ]
        ]
      ]
    ],
    [
      `${prefix}.fire.firelineIntensity`,
      [
        ['FireFirelineIntensity'],
        [
          [
            'finally',
            'SurfaceFire.firelineIntensity',
            `${prefix}.fire.spreadRate`,
            `${prefix}.fire.reactionIntensity`,
            `${prefix}.fire.flameResidenceTime`
          ]
        ]
      ]
    ],
    [
      `${prefix}.fire.flameLength`,
      [
        ['FireFlameLength'],
        [
          [
            'finally',
            'SurfaceFire.flameLength',
            `${prefix}.fire.firelineIntensity`
          ]
        ]
      ]
    ],
    [
      `${prefix}.fire.flameResidenceTime`,
      [
        ['FireResidenceTime'],
        [['finally', 'FuelBed.taur', `${prefix}.bed.surfaceAreaToVolumeRatio`]]
      ]
    ],
    [
      `${prefix}.fire.heading.fromUpslope`,
      [
        ['CompassAzimuth'],
        [
          [
            'finally',
            'SurfaceFire.spreadDirectionFromUpslope',
            `${prefix}.fire.maximumDirection.xComponent`,
            `${prefix}.fire.maximumDirection.yComponent`,
            `${prefix}.fire.maximumDirection.spreadRate`
          ]
        ]
      ]
    ],
    [
      `${prefix}.fire.heading.fromNorth`,
      [
        ['CompassAzimuth'],
        [
          [
            'finally',
            'Compass.sum',
            'site.slope.direction.upslope',
            `${prefix}.fire.heading.fromUpslope`
          ]
        ]
      ]
    ],
    [
      `${prefix}.fire.heatPerUnitArea`,
      [
        ['FireHeatPerUnitArea'],
        [
          [
            'finally',
            'FuelBed.heatPerUnitArea',
            `${prefix}.fire.reactionIntensity`,
            `${prefix}.fire.flameResidenceTime`
          ]
        ]
      ]
    ],
    [
      `${prefix}.fire.lengthToWidthRatio`,
      [
        ['FireLengthToWidthRatio'],
        [
          [
            'finally',
            'SurfaceFire.lengthToWidthRatio',
            `${prefix}.fire.effectiveWindSpeed`
          ]
        ]
      ]
    ],
    [
      `${prefix}.fire.phiEffectiveWind`,
      [
        ['Factor'],
        [
          [
            'when',
            'configure.fire.effectiveWindSpeedLimit',
            'equals',
            'applied',
            'Dag.bind',
            `${prefix}.fire.spread.step4.phiEffectiveWind`
          ],
          [
            'finally',
            'Dag.bind',
            `${prefix}.fire.spread.step3b.phiEffectiveWind`
          ]
        ]
      ]
    ],
    [
      `${prefix}.fire.reactionIntensity`,
      [
        ['FireReactionIntensity'],
        [['finally', 'Dag.bind', `${prefix}.bed.reactionIntensity`]]
      ]
    ],
    [
      `${prefix}.fire.scorchHeight`,
      [
        ['FireScorchHeight'],
        [
          [
            'finally',
            'SurfaceFire.scorchHeight',
            `${prefix}.fire.firelineIntensity`,
            `${prefix}.fire.wind.speed.atMidflame`,
            'site.temperature.air'
          ]
        ]
      ]
    ],
    [
      `${prefix}.fire.spreadRate`,
      [
        ['FireSpreadRate'],
        [
          [
            'when',
            'configure.fire.effectiveWindSpeedLimit',
            'equals',
            'applied',
            'Dag.bind',
            `${prefix}.fire.spread.step4.spreadRate`
          ],
          ['finally', 'Dag.bind', `${prefix}.fire.spread.step3b.spreadRate`]
        ]
      ]
    ],
    [
      `${prefix}.fire.noWindNoSlope.spreadRate`,
      [
        ['FireSpreadRate'],
        [['finally', 'Dag.bind', `${prefix}.bed.noWindNoSlope.spreadRate`]]
      ]
    ]
    // end `${prefix}.fire`
  ]
}
