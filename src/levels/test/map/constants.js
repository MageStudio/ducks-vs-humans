export const HUMAN_STARTING_POSITION = {
    x: 0,
    z: 0
};

export const NATURE_STARTING_POSITION = {
    x: 9,
    z: 9
};

export const DESERT_DETAILS = [
    'desertDetail',
    'desertRockA',
    'desertRockB',
    'desertPlantA',
    'desertPlantB',
    'desertTree',
];

export const FOREST_DETAILS = [
    'forestDetail',
    'forestRockA',
    'forestRockB',
    'forestPlantA',
    'forestPlantB',
    'forestTree',
];

export const HUMAN_DETAILS = [
    'largeBuildingA',
    'largeBuildingB',
    'largeBuildingC',
    'largeBuildingD',
    'largeBuildingE',
    'largeBuildingG'
];

export const TILES_TYPES = {
    EMPTY: 'empty',
    WATER: 'waterTile',
    DESERT: 'desertTile',
    FOREST: 'forestTile',
    HUMAN: 'humanTile'
};

export const TILES_STATES = {
    BUILDING: 'BUILDING',
    FIGHTING: 'FIGHTING'
};

export const TILES_DETAILS_MAP = {
    [TILES_TYPES.DESERT]: DESERT_DETAILS,
    [TILES_TYPES.FOREST]: FOREST_DETAILS,
    [TILES_TYPES.HUMAN]: HUMAN_DETAILS
};

export const STARTING_TILE_DETAILS_MAP = {
    [TILES_TYPES.HUMAN]: 'humanStart',
    [TILES_TYPES.FOREST]: 'forestStart'
};

export const TILES_RANDOMNESS_MAP = {
    [TILES_TYPES.DESERT]: .7,
    [TILES_TYPES.FOREST]: .3,
    [TILES_TYPES.HUMAN]: 0
};

export const TILE_SCALE = {
    x: .97,
    z: 1.12,
    y: 1
};

export const TILE_LARGE_DETAILS_SCALE = {
    x: .2,
    y: .2,
    z: .2
};

export const TILE_DETAILS_SCALE = {
    x: .3,
    y: .3,
    z: .3
};

export const TILE_DETAILS_RELATIVE_POSITION = {
    y: .2
};

export const TILE_MATERIAL_PROPERTIES = {
    metalness: 0.2,
    roughness: 1.0
};

export const TILE_COLLECTIBLE_SCALE = {
    x: .3,
    y: .3,
    z: .3
}