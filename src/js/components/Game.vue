<template>
  <div class="containerGame">
    <n-space class="info" justify="space-around">
      <span><b>Tiempo restante:</b> {{ time }}</span>
      <span><b>Ronda:</b> {{ round }}</span>
      <span><b>Nivel:</b> {{ rules[level].name }}</span>
    </n-space>

    <div id="countdown"></div>
    <div id="game"></div>

    <!-- <n-space>
      <n-button type="primary" @click="nextState('win')">Ganaste</n-button><br>
      <n-button type="primary" @click="nextState('lose')">Perdiste</n-button>
    </n-space> -->
  </div>
</template>

<script>
import { NButton, NSpace } from "naive-ui";
import { STATES, COLORS } from "../../assets/variables";

const objects = [],
  animations = [];
const colorsIndexSelected = [],
  geometriesSelected = [];
let scene, camera, renderer, light;


export default {
  name: "Game",
  components: {
    NButton,
    NSpace,
  },
  props: {
    level: Number,
  },
  data() {
    return {
      sequenceSize: 0,
      time: 0,
      round: 0,
      running: false,
      rules: {
        0: {
          name: "Fácil",
          numObjects: 4,
          timeForObject: 3,
          timeMultiplier: 3, // 3 * sequenceSize
        },
        1: {
          name: "Medio",
          numObjects: 5,
          timeForObject: 2,
          timeMultiplier: 2,
        },
        2: {
          name: "Difícil",
          numObjects: 6,
          timeForObject: 1,
          timeMultiplier: 1.5,
        },
      },
    };
  },
  mounted() {
    this.displayInfo();
    this.displayCountdown();
  },
  watch: {
    running() {
      if (this.running === true) this.start();
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
      this.sequenceSize = this.rules[this.level].numObjects;
      this.time =
        this.sequenceSize *
        this.rules[this.level].timeForObject *
        this.rules[this.level].timeMultiplier;
    },
    displayCountdown() {
      let contdown = 0;
      const intervalId = setInterval(countdown, 1000);
      const node = document.getElementById("countdown");
      node.style.display = "block";
      const thisOrigin = this;

      function countdown() {
        if (contdown == 0) {
          node.textContent = "¡YA!";
          clearInterval(intervalId);
          setTimeout(() => {
            node.style.display = "none";
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

      // Build a cube
      for (let i = 0; i < this.rules[this.level].numObjects; ++i) {
        this.createObject(i);
      }

      // Set camera position
      camera.position.z = 5;

      // Render the scene
      // It is a loop that draw the scene every time the screen is refresed (about 60 times/second)
      this.animate();
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
      requestAnimationFrame(this.animate);

      // Animate the cube
      // this.cube.rotation.x += 0.01;
      // this.cube.rotation.y += 0.01;

      this.animateObjects();

      renderer.render(scene, camera);
    },
    animateObjects() {
      for (let i = 0; i < objects.length; i++) {
        if (animations.length < objects.length) {
          animations.push(this.generateAnimation());
          console.log(animations)
        }
        objects[i].rotation.x += animations[i].rotX;
        objects[i].rotation.y += animations[i].rotY;
        objects[i].rotation.z += animations[i].rotZ;
      }
    },
    generateAnimation() {
        switch(this.getRandom(0, 6)) {
          case 0: return { rotX: this.getRandomNotTrunc(-0.05, 0.05), rotY: 0, rotZ: 0 };
          case 1: return { rotX: 0, rotY: this.getRandomNotTrunc(-0.05, 0.05), rotZ: 0 };
          case 2: return { rotX: 0, rotY: 0, rotZ: this.getRandomNotTrunc(-0.05, 0.05) };
          case 3: return { rotX: this.getRandomNotTrunc(-0.05, 0.05), rotY: this.getRandomNotTrunc(-0.05, 0.05), rotZ: 0 };
          case 4: return { rotX: this.getRandomNotTrunc(-0.05, 0.05), rotY: 0, rotZ: this.getRandomNotTrunc(-0.05, 0.05) };
          case 5: return { rotX: 0, rotY: this.getRandomNotTrunc(-0.05, 0.05), rotZ: this.getRandomNotTrunc(-0.05, 0.05) };
          default: return { rotX: this.getRandomNotTrunc(-0.05, 0.05), rotY: this.getRandomNotTrunc(-0.05, 0.05), rotZ: this.getRandomNotTrunc(-0.05, 0.05) };
        }
    },
    getRandom(min, max) {
      return Math.trunc(Math.random() * (max - min) + min); // min included, max excluded
    },
    getRandomNotTrunc(min, max) {
      let num = Math.random() * (max - min) + min; // min included, max excluded
      if (num < 0.02 && num > - 0.02) return this.getRandomNotTrunc(min, max);
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
        case 0: return new THREE.BoxGeometry();
        case 1: return new THREE.ConeGeometry();
        case 2: return new THREE.IcosahedronGeometry(0.8);
        case 3: return new THREE.OctahedronGeometry(0.8);
        case 4: return new THREE.TorusGeometry(0.5, 0.2);
        case 5: return new THREE.SphereGeometry(0.7);
        default: return new THREE.TorusKnotGeometry(0.3);
      }
    },
  },
};
</script>

<style scoped>
.containerGame {
  background-color: lightsalmon;
  height: 100%;
  width: 100%;
}

.info {
  width: 100%;
  background: lightgrey;
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
}
</style>
