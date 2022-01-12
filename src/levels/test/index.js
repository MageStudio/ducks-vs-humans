import {
    Level,
    Scene,
    Models,
    AmbientLight,
    HemisphereLight,
    Controls,
    constants,
    THREE,
    Cube,
    Scripts,
    SunLight,
    Universe,
    PostProcessing,
    Sky
} from 'mage-engine';

import TileMap, { HUMAN_DETAILS } from './map/TileMap';
import SlowRotation from './collectibles/slowRotation';
import Worm from './worm';
import WormBlock from './worm/wormBlock';
import HumanBehaviour from './humans/HumanBehaviour';
import Humans from './humans';
import Nature from './nature';
import Selector from './nature/Selector';
import BulletBehaviour from './humans/BulletBehaviour';
import DuckBehaviour from './nature/DuckBehaviour';
import Bobbing from './map/Bobbing';

export const WHITE = 0xffffff;
export const SUNLIGHT = 0xffeaa7;
export const DARKER_GROUND = 0X78e08f;
export const GROUND = 0xb8e994;
export const BACKGROUND = 0xdff9fb;//0xddf3f5;

// const DOF_OPTIONS = {
//     focus: 1.0,
//     aperture: 0.0001,
//     maxblur: 0.01
// };

const SATURATION_OPTIONS = {
    saturation: 0.4
};

const { EFFECTS } = constants;

export default class Test extends Level {

    addSunLight() {

        this.hemisphereLight = new HemisphereLight({
            color: {
                sky: 0xff9f43,
                ground: GROUND
            },
            intensity: 1
        });

        this.sunLight = new SunLight({ color: 0xff9f43, intensity: 1, far: 20 });
        this.sunLight.setPosition({ y: 4, z: -3, x: -3 });
    }

    addSky() {
        this.sky = new Sky({});
        // this.sky.setSun(180, .205, 100);
        this.sky.setSun(30, .01, 100);
        window.sky = this.sky;
    }

    prepareCamera() {
        Scene.getCamera().setPosition({ x: 7.8, y: 5.48, z: 12.8 });
        Controls.setOrbitControl({ target: { x: 5, y: 0, z: 5 } });
    }

    prepareSceneEffects() {
        Scene.setClearColor(0xff9f43);
        Scene.setBackground(0xff9f43);
        Scene.setRendererOutputEncoding(THREE.sRGBEncoding);
        PostProcessing.add(EFFECTS.HUE_SATURATION, SATURATION_OPTIONS);
    }

    createWorld() {
        this.addSunLight();
        this.addSky();
        this.prepareSceneEffects();

        TileMap.generate(0);
        // Humans.start();

        // window.humans = Humans;
        // const human = Humans.spawnHuman();
        // Worm.start();
        window.uni = Universe;
        window.n = Nature;
        window.tm = TileMap;
        // Nature.start();
    }

    onCreate() {
        Scripts.create('WormBlock', WormBlock);
        Scripts.create('slowRotation', SlowRotation);
        Scripts.create('HumanBehaviour', HumanBehaviour);
        Scripts.create('BulletBehaviour', BulletBehaviour);
        Scripts.create('DuckBehaviour', DuckBehaviour);
        Scripts.create('Selector', Selector);
        Scripts.create('Bobbing', Bobbing);

        this.createWorld();
        this.prepareCamera();
    }
}