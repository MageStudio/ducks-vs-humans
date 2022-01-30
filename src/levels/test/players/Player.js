import { Models, ENTITY_EVENTS, math } from "mage-engine";
import { HUMAN_TILES, TILES_STATES, TILES_TYPES } from "../map/constants";
import TileMap from "../map/TileMap";
import { DEATH_REASONS } from '../constants';

export const BASE_TILE_ENERGY_INCREASE = 5;
const MIN_ENERGY = 0;
const MAX_ENERGY = 100;

export default class Player {

    constructor(type) {
        this.builders = [];
        this.warriors = [];

        this.energy = 0;

        this.type = type;
    }

    updateEnergy() {
        const energy = (TileMap
            .getTilesByType(this.getBaseTileType())
            .filter(t => t.isBaseTile())
            .length || 0) * BASE_TILE_ENERGY_INCREASE;

        this.energy = math.clamp(energy, MIN_ENERGY, MAX_ENERGY);

        return this.energy;
    }

    start(position) {
        this.initialPosition = position;
    }

    handleUnitDeath = (reason) => ({ target }) => {
        if (reason === DEATH_REASONS.BUILDING) {
            delete this.builders[target.uuid()];
        }

        if (reason === DEATH_REASONS.KILLED) {
            delete this.warriors[target.uuid()]
        }
    }

    getBaseTileType = () => TILES_TYPES.HUMAN;
    getWarriorsHutVariation = () => HUMAN_TILES.HUMAN_WARRIORS_HUT;
    getBuildersHutVariation = () => HUMAN_TILES.HUMAN_BUILDERS_HUT;
    getTowerVariation = () => HUMAN_TILES.HUMAN_TOWER;
    
    getUnitScriptName = () =>'UnitBehaviour';

    buildBaseTile(destination) {
        this.sendBuilderToTile(TileMap.getTileAt(destination), this.getBaseTileType());
        this.updateEnergy();
    }
    buildWarriorsHut = (destination) => this.sendBuilderToTile(TileMap.getTileAt(destination), this.getWarriorsHutVariation());
    buildBuildersHut = (destination) => this.sendBuilderToTile(TileMap.getTileAt(destination), this.getBuildersHutVariation());
    buildTower = (destination) => this.sendBuilderToTile(TileMap.getTileAt(destination), this.getTowerVariation());

    sendBuilderToTile(tile, variation) {
        const unit = Models.getModel(this.type, { name: `${this.type}_builder_${Math.random()}`});
        const start = this.initialPosition;
        const behaviour = unit.addScript(this.getUnitScriptName(), { position: start, builder: true });

        behaviour
            .goTo(start, tile)
            .then(() => behaviour.buildAtPosition(tile, variation));

        TileMap.setTileState(tile, TILES_STATES.BUILDING);
        unit.addEventListener(ENTITY_EVENTS.DISPOSE, this.handleUnitDeath(DEATH_REASONS.BUILDING));

        this.builders[unit.uuid()] = unit;

        return unit;
    }

    sendWarriorToTile = tile => {
        const unit = Models.getModel(this.type, { name: `${this.type}_warrior_${Math.random()}`});
        const behaviour = unit.addScript(this.getUnitScriptName(), { position: this.initialPosition, warrior: true });

        behaviour
            .goTo(start, tile)
            .then(() => behaviour.scanForTargets(tile));

        // TileMap.setTileState(tile, TILES_STATES.FIGHTING);
        unit.addEventListener(ENTITY_EVENTS.DISPOSE, this.handleUnitDeath(DEATH_REASONS.KILLED));

        this.warriors[unit.uuid()] = unit;

        return unit;
    }
}