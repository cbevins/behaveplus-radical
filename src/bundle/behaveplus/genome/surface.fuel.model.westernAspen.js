export function genome (prefix, fuel) {
  return [
    [`${prefix}.model.westernAspen.domain`, [['FuelModelDomainOption'], [
      ['finally', 'Dag.fixed', 'westernAspen']
    ]]],
    [`${prefix}.model.westernAspen.parms.aspenType`, [['WesternAspenTypeOption'], [
      ['when', `configure.fuel.${fuel}`, 'equals', 'catalog', 'FuelCatalog.westernAspenFuelType',
        `${prefix}.model.catalogKey`
      ],
      ['when', `configure.fuel.${fuel}`, 'equals', 'westernAspen', 'Dag.input'],
      ['finally', 'Dag.fixed', 'aspenShrub']
    ]]],
    [`${prefix}.model.westernAspen.parms.curingLevel`, [['FuelDeadFraction'], [
      ['when', `configure.fuel.${fuel}`, 'equals', 'catalog', 'FuelCatalog.westernAspenCuringLevel',
        `${prefix}.model.catalogKey`
      ],
      ['when', `configure.fuel.${fuel}`, 'equals', 'westernAspen', 'Dag.input'],
      ['finally', 'Dag.fixed', 0]
    ]]],
    // end `${prefix}.model.westernAspen.parms`
    [`${prefix}.model.westernAspen.derived.depth`, [['FuelBedDepth'], [
      ['finally', 'WesternAspen.depth',
        `${prefix}.model.westernAspen.parms.aspenType`
      ]
    ]]],
    [`${prefix}.model.westernAspen.derived.dead.fine.ovendryLoad`, [['FuelOvendryLoad'], [
      ['finally', 'WesternAspen.deadFineLoad',
        `${prefix}.model.westernAspen.parms.aspenType`,
        `${prefix}.model.westernAspen.parms.curingLevel`
      ]
    ]]],
    [`${prefix}.model.westernAspen.derived.dead.small.ovendryLoad`, [['FuelOvendryLoad'], [
      ['finally', 'WesternAspen.deadSmallLoad',
        `${prefix}.model.westernAspen.parms.aspenType`
      ]
    ]]],
    [`${prefix}.model.westernAspen.derived.dead.fine.surfaceAreaToVolumeRatio`, [['FuelOvendryLoad'], [
      ['finally', 'WesternAspen.deadFineSavr',
        `${prefix}.model.westernAspen.parms.aspenType`,
        `${prefix}.model.westernAspen.parms.curingLevel`
      ]
    ]]],
    [`${prefix}.model.westernAspen.derived.live.herb.ovendryLoad`, [['FuelOvendryLoad'], [
      ['finally', 'WesternAspen.liveHerbLoad',
        `${prefix}.model.westernAspen.parms.aspenType`,
        `${prefix}.model.westernAspen.parms.curingLevel`
      ]
    ]]],
    [`${prefix}.model.westernAspen.derived.live.stem.ovendryLoad`, [['FuelOvendryLoad'], [
      ['finally', 'WesternAspen.liveStemLoad',
        `${prefix}.model.westernAspen.parms.aspenType`,
        `${prefix}.model.westernAspen.parms.curingLevel`
      ]
    ]]],
    [`${prefix}.model.westernAspen.derived.live.stem.surfaceAreaToVolumeRatio`, [['FuelOvendryLoad'], [
      ['finally', 'WesternAspen.liveStemSavr',
        `${prefix}.model.westernAspen.parms.aspenType`,
        `${prefix}.model.westernAspen.parms.curingLevel`
      ]
    ]]]
    // end `${prefix}.model.westernAspen.derived`
  ]
}
