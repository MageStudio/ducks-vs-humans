import { Models, ENTITY_EVENTS, math, Scripts } from "mage-engine";
import { TILES_STATES, TILES_TYPES, TILES_VARIATIONS_TYPES } from "../map/constants";
import TileMap from "../map/TileMap";
import { DEATH_REASONS } from '../constants';
import { getEnergyRequirementForTileVariation } from "./energy";
import { UNIT_TYPES } from "./UnitBehaviour";
import { TARGET_DEAD_EVENT_TYPE, TARGET_HEALTH_MAP } from "../TargetBehaviour";

export const BASE_TILE_ENERGY_INCREASE = .2;
const MIN_ENERGY = 0;
const MAX_ENERGY = 100;

export default class Player {

    constructor(type) {
        this.builders = {};
        this.warriors = {};

        this.energy = 100;

        this.type = type;
    }

    getUnits() {
        return [
            ...Object.values(this.builders),
            ...Object.values(this.warriors)
        ]
    }

    updateEnergy() {
        const increase =  (TileMap
            .getTilesByType(this.getBaseTileType())
            .filter(t => t.isBaseTile())
            .length || 0) * BASE_TILE_ENERGY_INCREASE;

        this.energy = math.clamp(this.energy + increase, MIN_ENERGY, MAX_ENERGY);
    }

    removeEnergyForVariationBuild(variation) {
        this.energy -= getEnergyRequirementForTileVariation(variation);
    }

    start(position) {
        this.initialPosition = position;
        this.energyUpdateTimer = setInterval(this.updateEnergy.bind(this), 2000);
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
    getWarriorsHutVariation = () => TILES_VARIATIONS_TYPES.WARRIORS;
    getBuildersHutVariation = () => TILES_VARIATIONS_TYPES.BUILDERS;
    getTowerVariation = () => TILES_VARIATIONS_TYPES.TOWER;
    
    getUnitScriptName = () => 'UnitBehaviour';

    canBuildVariation(variation) {
        return this.energy >= getEnergyRequirementForTileVariation(variation);
    }

    buildBaseTile(destination, startingPosition) {
        this.updateEnergy();
        return this.sendBuilderToTile(TileMap.getTileAt(destination), TILES_VARIATIONS_TYPES.BASE, startingPosition);
    };

    buildWarriorsHut = (destination, startingPosition) => (
        this.canBuildVariation(TILES_VARIATIONS_TYPES.WARRIORS) ?
            this.sendBuilderToTile(TileMap.getTileAt(destination), TILES_VARIATIONS_TYPES.WARRIORS, startingPosition) :
            Promise.resolve()
    );

    buildBuildersHut = (destination, startingPosition) => (
        this.canBuildVariation(TILES_VARIATIONS_TYPES.BUILDERS) ?
            this.sendBuilderToTile(TileMap.getTileAt(destination), TILES_VARIATIONS_TYPES.BUILDERS, startingPosition) :
            Promise.resolve()
    );

    buildTower = (destination, startingPosition) => (
        this.canBuildVariation(TILES_VARIATIONS_TYPES.TOWER) ?
            this.sendBuilderToTile(TileMap.getTileAt(destination), TILES_VARIATIONS_TYPES.TOWER, startingPosition) :
            Promise.resolve()
    );

    sendBuilderToTile(tile, variation, position = this.initialPosition) {
        const unit = Models.get(this.type, { name: `${this.type}_builder_${Math.random()}`});
        const behaviour = unit.addScript(this.getUnitScriptName(), { position, unitType: UNIT_TYPES.BUILDER });

        TileMap.setTileState(tile, TILES_STATES.BUILDING);
        this.setUpUnitTargetBehaviour(unit, TARGET_HEALTH_MAP.UNITS.BUILDERS);
        unit.addEventListener(ENTITY_EVENTS.DISPOSE, this.handleUnitDeath(DEATH_REASONS.BUILDING));

        this.builders[unit.uuid()] = unit;

        this.removeEnergyForVariationBuild(variation);

        return new Promise(resolve => {
            behaviour
                .goTo(position, tile)
                .then(() => behaviour.buildAtPosition(tile, variation))
                .then(resolve);
        });
    }

    setUpUnitTargetBehaviour(unit, health) {
        unit.addScript('TargetBehaviour', { health });
        unit.addEventListener(TARGET_DEAD_EVENT_TYPE, () => {
            unit.dispose();
        });
    }

    sendWarriorToTile = (destination, position = this.initialPosition) => {
        const unit = Models.get(this.type, { name: `${this.type}_warrior_${Math.random()}`});
        const behaviour = unit.addScript(this.getUnitScriptName(), { position, unitType: UNIT_TYPES.WARRIOR });
        const tile = TileMap.getTileAt(destination);

        this.setUpUnitTargetBehaviour(unit, TARGET_HEALTH_MAP.UNITS.WARRIORS);

        unit.addEventListener(ENTITY_EVENTS.DISPOSE, this.handleUnitDeath(DEATH_REASONS.KILLED));
        
        this.warriors[unit.uuid()] = unit;
        
        return new Promise(resolve => {
            behaviour
                .goTo(position, tile)
                .then(() => behaviour.scanForTargets(tile))
                .then(resolve);
        });
    }
}