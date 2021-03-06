// 0 empty
// 1 water
// 2 desert
// 3 nature
// 4 human

const MAP = [
    [0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1],
    [1, 1, 2, 1, 1, 2, 2, 2, 1, 2, 2, 2, 1, 0],
    [0, 1, 2, 1, 1, 2, 2, 1, 2, 2, 2, 2, 1, 0],
    [0, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 1, 0],
    [0, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 0, 0],
    [1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 0],
    [1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0],
    [0, 0, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 0, 0],
    [0, 1, 2, 2, 2, 2, 1, 2, 2, 1, 2, 2, 1, 0],
    [0, 0, 1, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 0],
    [0, 1, 2, 2, 1, 1, 2, 2, 1, 2, 2, 2, 1, 1],
    [1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
];

const HUMAN_STARTING_POSITION = { x: 11, z: 11 };
const NATURE_STARTING_POSITION = { x: 2, z: 2 };

export default {
    MAP,
    HUMAN_STARTING_POSITION,
    NATURE_STARTING_POSITION
}