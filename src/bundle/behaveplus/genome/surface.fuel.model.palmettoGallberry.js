export function genome (prefix, fuel) {
  return [
    [`${prefix}.model.palmettoGallberry.domain`, [['FuelModelDomainOption'], [
      ['finally', 'Dag.fixed', 'palmettoGallberry']
    ]]],
    [`${prefix}.model.palmettoGallberry.parms.age`, [['FuelAge'], [
      ['when', `configure.fuel.${fuel}`, 'equals', 'catalog', 'FuelCatalog.palmettoGallberryAge',
        `${prefix}.model.catalogKey`
      ],
      ['when', `configure.fuel.${fuel}`, 'equals', 'palmettoGallberry', 'Dag.input'],
      ['finally', 'Dag.fixed', 0]
    ]]],
    [`${prefix}.model.palmettoGallberry.parms.basalArea`, [['FuelBasalArea'], [
      ['when', `configure.fuel.${fuel}`, 'equals', 'catalog', 'FuelCatalog.palmettoGallberryBasalArea',
        `${prefix}.model.catalogKey`
      ],
      ['when', `configure.fuel.${fuel}`, 'equals', 'palmettoGallberry', 'Dag.input'],
      ['finally', 'Dag.fixed', 0]
    ]]],
    [`${prefix}.model.palmettoGallberry.parms.cover`, [['FuelCoverFraction'], [
      ['when', `configure.fuel.${fuel}`, 'equals', 'catalog', 'FuelCatalog.palmettoGallberryCover',
        `${prefix}.model.catalogKey`
      ],
      ['when', `configure.fuel.${fuel}`, 'equals', 'palmettoGallberry', 'Dag.input'],
      ['finally', 'Dag.fixed', 0]
    ]]],
    [`${prefix}.model.palmettoGallberry.parms.height`, [['FuelBedDepth'], [
      ['when', `configure.fuel.${fuel}`, 'equals', 'catalog', 'FuelCatalog.palmettoGallberryHeight',
        `${prefix}.model.catalogKey`
      ],
      ['when', `configure.fuel.${fuel}`, 'equals', 'palmettoGallberry', 'Dag.input'],
      ['finally', 'Dag.fixed', 0.01]
    ]]],
    // end `${prefix}.model.palmettoGallberry.parms`
    [`${prefix}.model.palmettoGallberry.derived.depth`, [['FuelBedDepth'], [
      ['finally', 'PalmettoGallberry.fuelDepth',
        `${prefix}.model.palmettoGallberry.parms.height`
      ]
    ]]],
    [`${prefix}.model.palmettoGallberry.derived.deadFineLoad`, [['FuelOvendryLoad'], [
      ['finally', 'PalmettoGallberry.deadFineLoad',
        `${prefix}.model.palmettoGallberry.parms.age`,
        `${prefix}.model.palmettoGallberry.parms.height`
      ]
    ]]],
    [`${prefix}.model.palmettoGallberry.derived.deadSmallLoad`, [['FuelOvendryLoad'], [
      ['finally', 'PalmettoGallberry.deadSmallLoad',
        `${prefix}.model.palmettoGallberry.parms.age`,
        `${prefix}.model.palmettoGallberry.parms.cover`
      ]
    ]]],
    [`${prefix}.model.palmettoGallberry.derived.deadFoliageLoad`, [['FuelOvendryLoad'], [
      ['finally', 'PalmettoGallberry.deadFoliageLoad',
        `${prefix}.model.palmettoGallberry.parms.age`,
        `${prefix}.model.palmettoGallberry.parms.cover`
      ]
    ]]],
    [`${prefix}.model.palmettoGallberry.derived.deadLitterLoad`, [['FuelOvendryLoad'], [
      ['finally', 'PalmettoGallberry.deadLitterLoad',
        `${prefix}.model.palmettoGallberry.parms.age`,
        `${prefix}.model.palmettoGallberry.parms.basalArea`
      ]
    ]]],
    [`${prefix}.model.palmettoGallberry.derived.liveFineLoad`, [['FuelOvendryLoad'], [
      ['finally', 'PalmettoGallberry.liveFineLoad',
        `${prefix}.model.palmettoGallberry.parms.age`,
        `${prefix}.model.palmettoGallberry.parms.height`
      ]
    ]]],
    [`${prefix}.model.palmettoGallberry.derived.liveSmallLoad`, [['FuelOvendryLoad'], [
      ['finally', 'PalmettoGallberry.liveSmallLoad',
        `${prefix}.model.palmettoGallberry.parms.age`,
        `${prefix}.model.palmettoGallberry.parms.height`
      ]
    ]]],
    [`${prefix}.model.palmettoGallberry.derived.liveFoliageLoad`, [['FuelOvendryLoad'], [
      ['finally', 'PalmettoGallberry.liveFoliageLoad',
        `${prefix}.model.palmettoGallberry.parms.age`,
        `${prefix}.model.palmettoGallberry.parms.cover`,
        `${prefix}.model.palmettoGallberry.parms.height`
      ]
    ]]]
    // end `${prefix}.model.palmettoGallberry.derived`
  ]
}
