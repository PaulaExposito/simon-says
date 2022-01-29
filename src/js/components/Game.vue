<template>
  <div class="containerGame">
    <n-space class="info" justify="space-around">
      <span><b>Tiempo restante:</b> {{ time }}</span>
      <span><b>Ronda:</b> {{ round }}</span>
      <span><b>Nivel:</b> {{ rules[level].name }}</span>
    </n-space>

    <div id="countdown"></div>
    <div id="game"></div>
  </div>
</template>

<script>
import { NButton, NSpace } from "naive-ui";
import { STATES, COLORS, SHINE_COLOR } from "../../assets/variables";

let objects = [], animations = []; 
let colorsIndexSelected = [], geometriesSelected = [];
let scene, camera, renderer, light;

// Eventos
let clock, pickPosition, pickHelper;
let resquestAnimationId, remandingTimeIntervalId, loseTimeoutId;

class PickHelper {
  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.pickedObject = null;
    this.pickedObjectSavedColor = 0;
  }
  pick(normalizedPosition, scene, camera, time, userSequence) {
    // cast a ray through the frustum
    this.raycaster.setFromCamera(normalizedPosition, camera);
    // get the list of objects the ray intersected
    const intersectedObjects = this.raycaster.intersectObjects(scene.children);
    if (intersectedObjects.length) {
      // pick the first object. It's the closest one
      this.pickedObject = intersectedObjects[0].object;
      // save its color
      this.pickedObjectSavedColor =
        this.pickedObject.material.emissive.getHex();
      // set its emissive color to flashing red/yellow
      this.pickedObject.material.emissive.setHex(SHINE_COLOR);


      // Save clicked object
      userSequence.push(this.pickedObject);

      setTimeout(() => {
        this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
        this.pickedObject = undefined;
      }, 400);
    }
  }

  backLastColor() {
    this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
  }
}

export default {
  name: "Game",
  components: {
    NButton,
    NSpace,
  },
  props: {
    level: Number,
    roundInfo: Object,
  },
  data() {
    return {
      sequence: [],
      userSequence: [],
      sequenceSize: 0,
      time: 0,
      round: 0,
      running: false,
      rules: {
        0: {
          name: "Fácil",
          numObjects: 4,
          timeObjectIlluminated: 3,   // Tiempo que está iluminado el objeto
          timeMultiplier: 3, // 3 * sequenceSize
        },
        1: {
          name: "Medio",
          numObjects: 5,
          timeObjectIlluminated: 2,
          timeMultiplier: 2,
        },
        2: {
          name: "Difícil",
          numObjects: 6,
          timeObjectIlluminated: 1,
          timeMultiplier: 1.5,
        },
      },
    };
  },
  mounted() {
    this.fillNotFirstRoundInfo();
    this.displayInfo();
    this.displayCountdown(3, "¡YA!");
  },
  watch: {
    running() {
      if (this.running === true) {
        if (this.round === 1) 
          this.start();
        else
          this.restart();
      }
    },
  },
  methods: {
    nextState(action) {
      if (action === "win")
        this.$emit("changeState", { state: STATES.WIN_STATE });
      else this.$emit("changeState", { state: STATES.LOSE_STATE });
    },
    displayInfo() {
      this.round++;
      this.sequenceSize = this.round;
      this.time =
        this.sequenceSize *
        this.rules[this.level].timeMultiplier;
    },
    // countdown is the initial number of seconds
    displayCountdown(contdown, msg) {
      const intervalId = setInterval(countdown, 1000);
      const node = document.getElementById("countdown");
      node.style.display = "block";
      const thisOrigin = this;

      function countdown() {
        if (contdown == 0) {
          node.textContent = msg;
          clearInterval(intervalId);
          setTimeout(() => {
            node.style.visibility = "hidden";
            thisOrigin.running = true;
          }, 1000);
        } else {
          node.textContent = contdown;
          contdown--;
        }
      }
    },
    start() {
      this.initWorld();

      // Build the objects
      for (let i = 0; i < this.rules[this.level].numObjects; ++i) {
        this.createObject(i);
      }

      // Set camera position
      camera.position.z = 5;

      // Reloj
      clock = new THREE.Clock();

      // Render the scene
      // It is a loop that draw the scene every time the screen is refresed (about 60 times/second)
      this.animate();

      // Play
      this.play();
    },
    restart() {
      const gameNode = document.getElementById("game");

      renderer = new THREE.WebGLRenderer();
      renderer.setSize(gameNode.clientWidth, gameNode.clientHeight);
      document.getElementById("game").appendChild(renderer.domElement);

      camera.position.z = 5;
      clock = new THREE.Clock();

      // Render the scene
      // It is a loop that draw the scene every time the screen is refresed (about 60 times/second)
      this.animate();

      // Play
      this.play();
    },
    initWorld() {
      // To display anything with ThreeJS we need a scene, a camera and a renderer
      const gameNode = document.getElementById("game");
      scene = new THREE.Scene();

      // Ambient light
      light = new THREE.AmbientLight(0x404040, 3.8); // soft white light
      scene.add(light);

      // Directional light
      light = new THREE.DirectionalLight(0xc33e3e, 0.8);
      light.position.set(0, 10, 6);
      light.target.position.set(-1, -1, -1);
      scene.add(light);
      scene.add(light.target);

      camera = new THREE.PerspectiveCamera(
        75,
        gameNode.clientWidth / gameNode.clientHeight,
        0.1,
        1000
      );
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(gameNode.clientWidth, gameNode.clientHeight);
      document.getElementById("game").appendChild(renderer.domElement);
    },
    createObject(index) {
      const geometry = this.getRandomGeometry();

      const color = this.getRandomColor();
      const material = new THREE.MeshPhongMaterial({ color: color });

      let obj = new THREE.Mesh(geometry, material);

      const numObjects = this.rules[this.level].numObjects;

      obj.position.y = index < numObjects / 2 ? 1.2 : -1.2;

      let numObjsRow = Math.ceil(numObjects / 2);
      let relObjIndex = index % numObjsRow;

      if (obj.position.y < 0 && numObjsRow * 2 > numObjects)
        numObjsRow = numObjsRow - 1;

      if (numObjsRow % 2 == 1) {
        let centerObj = Math.trunc(numObjsRow / 2);

        if (relObjIndex == centerObj) {
          // Pos 0,0
          obj.position.x = 0;
        } else if (relObjIndex < centerObj) {
          // Left
          obj.position.x = -2 * (centerObj - relObjIndex);
        } else {
          // Right
          obj.position.x = 2 * (relObjIndex - centerObj);
        }
      } else {
        if (relObjIndex < numObjsRow / 2) {
          obj.position.x = -(1 + 2 * (numObjsRow / 2 - (relObjIndex + 1)));
        } else {
          obj.position.x =
            1 + 2 * (numObjsRow / 2 - (numObjsRow - relObjIndex));
        }
      }

      objects.push(obj);
      scene.add(obj); // By default puts the cube at (0,0,0), the same coordinates where the camera is so we need to move the camera
    },
    animate() {
      resquestAnimationId = requestAnimationFrame(this.animate);
      this.animateObjects();
      renderer.render(scene, camera);
    },
    animateObjects() {
      for (let i = 0; i < objects.length; i++) {
        if (animations.length < objects.length) {
          animations.push(this.generateAnimation());
        }
        objects[i].rotation.x += animations[i].rotX;
        objects[i].rotation.y += animations[i].rotY;
        objects[i].rotation.z += animations[i].rotZ;
      }
    },
    generateAnimation() {
      switch (this.getRandom(0, 6)) {
        case 0:
          return {
            rotX: this.getRandomNotTrunc(-0.05, 0.05),
            rotY: 0,
            rotZ: 0,
          };
        case 1:
          return {
            rotX: 0,
            rotY: this.getRandomNotTrunc(-0.05, 0.05),
            rotZ: 0,
          };
        case 2:
          return {
            rotX: 0,
            rotY: 0,
            rotZ: this.getRandomNotTrunc(-0.05, 0.05),
          };
        case 3:
          return {
            rotX: this.getRandomNotTrunc(-0.05, 0.05),
            rotY: this.getRandomNotTrunc(-0.05, 0.05),
            rotZ: 0,
          };
        case 4:
          return {
            rotX: this.getRandomNotTrunc(-0.05, 0.05),
            rotY: 0,
            rotZ: this.getRandomNotTrunc(-0.05, 0.05),
          };
        case 5:
          return {
            rotX: 0,
            rotY: this.getRandomNotTrunc(-0.05, 0.05),
            rotZ: this.getRandomNotTrunc(-0.05, 0.05),
          };
        default:
          return {
            rotX: this.getRandomNotTrunc(-0.05, 0.05),
            rotY: this.getRandomNotTrunc(-0.05, 0.05),
            rotZ: this.getRandomNotTrunc(-0.05, 0.05),
          };
      }
    },
    getRandom(min, max) {
      return Math.trunc(Math.random() * (max - min) + min); // min included, max excluded
    },
    getRandomNotTrunc(min, max) {
      let num = Math.random() * (max - min) + min; // min included, max excluded
      if (num < 0.02 && num > -0.02) return this.getRandomNotTrunc(min, max);
      else return num;
    },
    getRandomColor() {
      while (true) {
        const index = this.getRandom(0, COLORS.length);
        if (!colorsIndexSelected.includes(index)) {
          colorsIndexSelected.push(index);
          return COLORS[index];
        }
      }
    },
    getRandomGeometry() {
      const NUM_GEOMETRIES = 6;
      let geo = this.getRandom(0, NUM_GEOMETRIES);

      if (geometriesSelected.includes(geo))
        geo = this.getRandom(0, NUM_GEOMETRIES);

      let cont = 0;
      while (geometriesSelected.includes(geo) && cont < NUM_GEOMETRIES) {
        geo = this.getRandom(0, NUM_GEOMETRIES);
        cont++;
      }
      geometriesSelected.push(geo);

      switch (geo) {
        case 0:
          return new THREE.BoxGeometry();
        case 1:
          return new THREE.ConeGeometry();
        case 2:
          return new THREE.IcosahedronGeometry(0.8);
        case 3:
          return new THREE.OctahedronGeometry(0.8);
        case 4:
          return new THREE.TorusGeometry(0.5, 0.2);
        case 5:
          return new THREE.SphereGeometry(0.7);
        default:
          return new THREE.TorusKnotGeometry(0.3);
      }
    },
    getCanvasRelativePosition(event) {
      const canvas = renderer.domElement;
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((event.clientX - rect.left) * canvas.width) / rect.width,
        y: ((event.clientY - rect.top) * canvas.height) / rect.height,
      };
    },
    setPickPosition(event) {
      const canvas = renderer.domElement;
      const pos = this.getCanvasRelativePosition(event);

      pickPosition.x = (pos.x / canvas.width) * 2 - 1;
      pickPosition.y = (pos.y / canvas.height) * -2 + 1;

      let delta = clock.getDelta();
      pickHelper.pick(pickPosition, scene, camera, delta, this.userSequence);

      for (let i = 0; i < this.userSequence.length; i++) {
        if (this.userSequence[i] != this.sequence[i])
          this.lose();
        else if (i == this.sequence.length - 1)
          this.win();
      }

    },
    play() {
      const newSeqItem = this.getRandom(0, this.rules[this.level].numObjects);
      this.sequence.push(objects[newSeqItem]);
      let lastColor = null;

      // Time to start the visualization of the sequence
      setTimeout(() => {
        for (let i = 0; i < this.sequence.length; i++) {

          if (i == 0) {
            lastColor = this.sequence[i].material.emissive.getHex();
            this.sequence[i].material.emissive.setHex(SHINE_COLOR);
          }

          setTimeout(() => {
            this.sequence[i].material.emissive.setHex(lastColor);

            setTimeout(() => {
              if (i < this.sequence.length - 1) {
                lastColor = this.sequence[i + 1].material.emissive.getHex();
                this.sequence[i + 1].material.emissive.setHex(SHINE_COLOR);
              }
              else if (i == this.sequence.length - 1) {
                const node = document.getElementById("countdown");
                node.style.visibility = "visible";
                node.textContent = "¡TE TOCA!";

                setTimeout(() => {
                  node.style.visibility = "hidden";
                }, 500);

                // Dispatch event to start user turn
                this.checkUserSequence();
              }
            }, 500);
          }, (i * this.rules[this.level].timeObjectIlluminated + this.rules[this.level].timeObjectIlluminated) * 1000 - 500 );
        
        }
      }, 1000)

    },
    checkUserSequence() {
      // Change remaining time
      remandingTimeIntervalId = setInterval( () => this.time--, 1000);

      // If time it out lose the game
      loseTimeoutId = setTimeout(() => {
        clearInterval(remandingTimeIntervalId);
        this.lose();
      }, (this.sequence.length * this.rules[this.level].timeMultiplier) * 1000);

      // Check the sequence
      // Clicks
      pickPosition = { x: -10000, y: -10000 };
      pickHelper = new PickHelper();
      window.addEventListener('click', this.setPickPosition);
    },
    reset() {
      this.sequence = [];
      this.userSequence = [];
      this.sequenceSize = 0;
      this.time = 0;
      this.running = false;
      objects = [];
      animations = []; 
      colorsIndexSelected = [];
      geometriesSelected = [];
      scene = null;
      camera = null; 
    },
    resetThreeJS() {
      cancelAnimationFrame(resquestAnimationId);
      renderer = null; 
      light = null;
      clock = null;
      pickPosition = null;
      pickHelper = null; 
    },
    lose() {
      window.removeEventListener('click', this.setPickPosition);
      const loseRound = this.round - 1;
      this.reset(); 
      this.resetThreeJS();
      this.$emit('changeState', { 
                                  state: STATES.LOSE_STATE,
                                  level: this.level, 
                                  sendPuntuation: true,  
                                  round: loseRound,  
                                  objects: [],
                                  animations: [],
                                  sequence: null,
                                  scene: null,
                                  camera: null,
                                });
    },
    win() {
      clearInterval(remandingTimeIntervalId);
      clearTimeout(loseTimeoutId);
      window.removeEventListener('click', this.setPickPosition);

      this.resetThreeJS();
      
      this.$emit('changeState', { 
                                  state: STATES.WIN_STATE, 
                                  sendPuntuation: false,  
                                  level: this.level, 
                                  round: this.round,  
                                  objects: objects,
                                  animations: animations,
                                  sequence: this.sequence,
                                  scene: scene,
                                  camera: camera
                                });
    },
    fillNotFirstRoundInfo() {
      if (this.roundInfo != null && this.roundInfo.round != null) {
        this.round = this.roundInfo.round;
        objects = this.roundInfo.objects;
        animations = this.roundInfo.animations;
        this.sequence = this.roundInfo.sequence;
        escene = this.roundInfo.escene;
        camera = this.roundInfo.camera;
      }
      else {
        this.reset();
        this.resetThreeJS();
      }
    }
  },
};
</script>

<style scoped>
.containerGame {
  background-color: black;
  height: 100%;
  width: 100%;
}

.info {
  width: 100%;
  background: lightgrey;
  color: black;
}

#game {
  height: 100%;
  background: black;
}

#countdown {
  background-color: crimson;
  height: 30px;
  color: white;
  text-align: center;
  font-size: 20px;
  z-index: -1;
}

</style>
