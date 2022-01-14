import {
    BaseScript,
    constants,
    THREE,
    math,
    Sphere,
    ENTITY_EVENTS,
    PALETTES,
    Models
} from "mage-engine";
import { TILES_TYPES } from "../map/constants";
import TileMap from "../map/TileMap";

const { MATERIALS } = constants;
const { LoopOnce, Vector3 } = THREE;

const HUMAN_MATERIAL_PROPERTIES = {
    metalness: 0.2,
    roughness: 1.0
};

const HUMAN_SCALE = {
    x: 0.0008,
    y: 0.0008,
    z: 0.0008
};

const HUMAN_ANIMATIONS = {
    IDLE: 'Root|Idle',
    RUN: 'Root|Run',
    SHOOT: 'Root|Shoot',
    DEATH: 'Root|Death',
    BUILD: 'Root|CrouchIdle'
};

const MINIMUM_HEIGHT = .2;
const SPEEDS = {
    BUILDER: 0.5,
    WARRIOR: 0.8
}
const MAXIMUM_SHOOTING_DISTANCE = 4;
const BULLET_INTERVAL = 250;
const BULLET_SIZE = 0.01;

export default class HumanBehaviour extends BaseScript {

    constructor() {
        super('HumanBehaviour');
    }

    start(human, { position = {}, builder = false, warrior = false }) {
        this.human = human;
        this.position = {
            ...position,
            y: MINIMUM_HEIGHT
        };

        console.log('setting human at', this.position);

        this.builder = builder;
        this.warrior = warrior;

        window.human = human;

        this.human.setMaterialFromName(MATERIALS.STANDARD, HUMAN_MATERIAL_PROPERTIES);
        this.human.setScale(HUMAN_SCALE);
        this.human.playAnimation(HUMAN_ANIMATIONS.IDLE);
        this.human.setPosition(this.position);
    }
    
    addWeapon() {
        if (this.isWarrior()) {
            const weapon = Models.getModel('shotgun')
            weapon.setMaterialFromName(MATERIALS.STANDARD, HUMAN_MATERIAL_PROPERTIES);
            weapon.setPosition({ x: 5, y: 2, z: 5 });
            // weapon.setScale({ x: 50, y: 50, z: 50 });
            // window.weapon = weapon;
            // this.human.add(weapon);
        }
    }

    isBuilder() { return this.builder; }
    isWarrior() { return this.warrior; }
    getSpeed() {
        return this.isBuilder() ? SPEEDS.BUILDER : SPEEDS.WARRIOR;
    }

    die() {
        this.human.playAnimation(HUMAN_ANIMATIONS.DEATH, { loop: LoopOnce });
        this.human.fadeTo(0, 1000)
            .then(() => this.human.dispose());
    }

    lookAtTarget(target) {
        const { x, z } = target.getPosition();
        this.human.lookAt({
            x,
            y: MINIMUM_HEIGHT,
            z
        });
    }

    scanForTargets = () => {
        this.human.playAnimation(HUMAN_ANIMATIONS.IDLE);
        // get all enemy tiles
        const { tile } = math.pickRandom(
                TileMap.getTilesByType(TILES_TYPES.FOREST)
                    .map(tile => ({ tile, distance: this.human.getPosition().distanceTo(tile.getPosition()) }))
                    .filter(({ distance }) => distance <= MAXIMUM_SHOOTING_DISTANCE)
        )

        if (tile) {
            this.shootAt(tile);
        }
    }

    spawnBullet = () => {
        setTimeout(() => {
            new Sphere(BULLET_SIZE, PALETTES.BASE.BLACK)
                .addScript('BulletBehaviour', { position: this.human.getPosition(), target: this.target })
                .shoot()
        }, BULLET_INTERVAL);
    }

    shootAt(target) {
        if (!this.isWarrior()) return;

        this.target = target;
        this.lookAtTarget(target);
        
        if (this.human.getPosition().distanceTo(target.getPosition()) <= MAXIMUM_SHOOTING_DISTANCE) {
            this.human.playAnimation(HUMAN_ANIMATIONS.SHOOT);
            this.human.addEventListener(ENTITY_EVENTS.ANIMATION.LOOP, this.spawnBullet)
            this.spawnBullet();
        }
    }

    buildAtPosition(tile) {
        if (!this.isBuilder()) return;

        console.log('building here');

        this.human.playAnimation(HUMAN_ANIMATIONS.BUILD);
        setTimeout(() => {
            this.human.playAnimation(HUMAN_ANIMATIONS.IDLE);
            if (!tile.isHuman()) {
                TileMap.changeTile(tile.getIndex(), TILES_TYPES.HUMAN);
                this.die();
            }
        }, 3000)
    }

    goTo(tile) {
        console.log('going to ', tile);
        const { x, z } = tile.getPosition();
        const targetPosition = new Vector3(x, MINIMUM_HEIGHT, z);
        const time = this.human.getPosition().distanceTo(targetPosition) / this.getSpeed() * 1000;

        this.human.lookAt(targetPosition);
        this.human.playAnimation(HUMAN_ANIMATIONS.RUN);
        return this.human.goTo(targetPosition, time);
    }

    update() {
        if (this.target && this.isWarrior()) {
            this.lookAtTarget(this.target);
        }
    }
}