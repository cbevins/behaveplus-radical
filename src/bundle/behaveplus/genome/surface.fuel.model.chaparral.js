export function genome (prefix, fuel) {
  return [
    [`${prefix}.model.chaparral.domain`, [['FuelModelDomainOption'], [
      ['finally', 'Dag.fixed', 'chaparral']
    ]]],
    [`${prefix}.model.chaparral.parms.chaparralType`, [['ChaparralTypeOption'], [
      ['when', `configure.fuel.${fuel}`, 'equals', 'catalog', 'FuelCatalog.chaparralFuelType',
        `${prefix}.model.catalogKey`
      ],
      ['when', `configure.fuel.${fuel}`, 'equals', 'chaparral', 'Dag.input'],
      ['finally', 'Dag.fixed', 'chamise']
    ]]],
    [`${prefix}.model.chaparral.parms.observed.deadFuelFraction`, [['FuelDeadFraction'], [
      ['when', `configure.fuel.${fuel}`, 'equals', 'catalog', 'FuelCatalog.chaparralDeadFraction',
        `${prefix}.model.catalogKey`
      ],
      ['when', `configure.fuel.${fuel}`, 'equals', 'chaparral', 'Dag.input'],
      ['finally', 'Dag.fixed', 0]
    ]]],
    [`${prefix}.model.chaparral.parms.observed.depth`, [['FuelBedDepth'], [
      ['when', `configure.fuel.${fuel}`, 'equals', 'catalog', 'FuelCatalog.chaparralDepth',
        `${prefix}.model.catalogKey`
      ],
      ['when', `configure.fuel.${fuel}`, 'equals', 'chaparral', 'Dag.input'],
      ['finally', 'Dag.fixed', 0.01]
    ]]],
    [`${prefix}.model.chaparral.parms.observed.totalLoad`, [['FuelOvendryLoad'], [
      ['when', `configure.fuel.${fuel}`, 'equals', 'catalog',
        'FuelCatalog.chaparralTotalLoad',
        `${prefix}.model.catalogKey`],
      ['when', `configure.fuel.${fuel}`, 'equals', 'chaparral', 'Dag.input'],
      ['finally', 'Dag.fixed', 0]
    ]]],
    [`${prefix}.model.chaparral.parms.applied.totalLoad`, [['FuelOvendryLoad'], [
      ['when', 'configure.fuel.chaparralTotalLoad', 'equals', 'estimated',
        'Dag.bind', `${prefix}.model.chaparral.derived.totalLoad`],
      ['finally', 'Dag.bind', `${prefix}.model.chaparral.parms.observed.totalLoad`]
    ]]],
    // end `${prefix}.model.chaparral.parms`
    [`${prefix}.model.chaparral.derived.age`, [['FuelAge'], [
      ['finally', 'Chaparral.age',
        `${prefix}.model.chaparral.parms.observed.depth`,
        `${prefix}.model.chaparral.parms.chaparralType`]
    ]]],
    [`${prefix}.model.chaparral.derived.averageMortality`, [['MortalityFraction'], [
      ['finally', 'Chaparral.deadFractionAverageMortality',
        `${prefix}.model.chaparral.derived.age`]
    ]]],
    [`${prefix}.model.chaparral.derived.severeMortality`, [['MortalityFraction'], [
      ['finally', 'Chaparral.deadFractionSevereMortality',
        `${prefix}.model.chaparral.derived.age`]
    ]]],
    [`${prefix}.model.chaparral.derived.depth`, [['FuelBedDepth'], [
      ['finally', 'Chaparral.fuelDepth',
        `${prefix}.model.chaparral.derived.age`,
        `${prefix}.model.chaparral.parms.chaparralType`]
    ]]],
    [`${prefix}.model.chaparral.derived.totalLoad`, [['FuelOvendryLoad'], [
      ['finally', 'Chaparral.totalLoad',
        `${prefix}.model.chaparral.derived.age`,
        `${prefix}.model.chaparral.parms.chaparralType`]
    ]]],
    [`${prefix}.model.chaparral.derived.deadLoad`, [['FuelOvendryLoad'], [
      ['finally', 'Chaparral.deadLoad',
        `${prefix}.model.chaparral.parms.applied.totalLoad`,
        `${prefix}.model.chaparral.parms.observed.deadFuelFraction`]
    ]]],
    [`${prefix}.model.chaparral.derived.deadFineLoad`, [['FuelOvendryLoad'], [
      ['finally', 'Chaparral.deadClass1Load',
        `${prefix}.model.chaparral.parms.applied.totalLoad`,
        `${prefix}.model.chaparral.parms.observed.deadFuelFraction`]
    ]]],
    [`${prefix}.model.chaparral.derived.deadSmallLoad`, [['FuelOvendryLoad'], [
      ['finally', 'Chaparral.deadClass2Load',
        `${prefix}.model.chaparral.parms.applied.totalLoad`,
        `${prefix}.model.chaparral.parms.observed.deadFuelFraction`]
    ]]],
    [`${prefix}.model.chaparral.derived.deadMediumLoad`, [['FuelOvendryLoad'], [
      ['finally', 'Chaparral.deadClass3Load',
        `${prefix}.model.chaparral.parms.applied.totalLoad`,
        `${prefix}.model.chaparral.parms.observed.deadFuelFraction`]
    ]]],
    [`${prefix}.model.chaparral.derived.deadLargeLoad`, [['FuelOvendryLoad'], [
      ['finally', 'Chaparral.deadClass4Load',
        `${prefix}.model.chaparral.parms.applied.totalLoad`,
        `${prefix}.model.chaparral.parms.observed.deadFuelFraction`]
    ]]],
    [`${prefix}.model.chaparral.derived.liveLoad`, [['FuelOvendryLoad'], [
      ['finally', 'Chaparral.liveLoad',
        `${prefix}.model.chaparral.parms.applied.totalLoad`,
        `${prefix}.model.chaparral.parms.observed.deadFuelFraction`]
    ]]],
    [`${prefix}.model.chaparral.derived.liveFineLoad`, [['FuelOvendryLoad'], [
      ['finally', 'Chaparral.liveClass1Load',
        `${prefix}.model.chaparral.parms.applied.totalLoad`,
        `${prefix}.model.chaparral.parms.observed.deadFuelFraction`]
    ]]],
    [`${prefix}.model.chaparral.derived.liveSmallLoad`, [['FuelOvendryLoad'], [
      ['finally', 'Chaparral.liveClass2Load',
        `${prefix}.model.chaparral.parms.applied.totalLoad`,
        `${prefix}.model.chaparral.parms.observed.deadFuelFraction`]
    ]]],
    [`${prefix}.model.chaparral.derived.liveMediumLoad`, [['FuelOvendryLoad'], [
      ['finally', 'Chaparral.liveClass3Load',
        `${prefix}.model.chaparral.parms.applied.totalLoad`,
        `${prefix}.model.chaparral.parms.observed.deadFuelFraction`]
    ]]],
    [`${prefix}.model.chaparral.derived.liveLargeLoad`, [['FuelOvendryLoad'], [
      ['finally', 'Chaparral.liveClass4Load',
        `${prefix}.model.chaparral.parms.applied.totalLoad`,
        `${prefix}.model.chaparral.parms.observed.deadFuelFraction`]
    ]]],
    [`${prefix}.model.chaparral.derived.liveLeafLoad`, [['FuelOvendryLoad'], [
      ['finally', 'Chaparral.liveClass5Load',
        `${prefix}.model.chaparral.parms.applied.totalLoad`,
        `${prefix}.model.chaparral.parms.observed.deadFuelFraction`]
    ]]]
    // end `${prefix}.model.chaparral.derived`
  ]
}
