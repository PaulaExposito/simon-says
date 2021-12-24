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
import { STATES } from "../../assets/variables";

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
          numInitObjects: 4,
          timeForObject: 3,
          timeMultiplier: 3, // 3 * sequenceSize
        },
        1: {
          name: "Medio",
          numInitObjects: 5,
          timeForObject: 2,
          timeMultiplier: 2,
        },
        2: {
          name: "Difícil",
          numInitObjects: 6,
          timeForObject: 1,
          timeMultiplier: 1.5,
        },
      },
      threeJS: {
        scene: null,
        camera: null,
        renderer: null,
        cube: null
      }
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
      this.sequenceSize = this.rules[this.level].numInitObjects;
      this.time =
        this.sequenceSize *
        this.rules[this.level].timeForObject *
        this.rules[this.level].timeMultiplier;
    },
    displayCountdown() {
      let contdown = 3;
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
      const gameNode = document.getElementById("game");
      console.log("start");

      // To display anything with ThreeJS we need a scene, a camera and a renderer
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(
        75,
        gameNode.clientWidth / gameNode.clientHeight,
        0.1,
        1000
      );
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(gameNode.clientWidth, gameNode.clientHeight);
      document.getElementById("game").appendChild(this.renderer.domElement);

      // Build a cube
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      this.cube = new THREE.Mesh(geometry, material);
      this.scene.add(this.cube); // By default puts the cube at (0,0,0), the same coordinates where the camera is so we need to move the camera

      this.camera.position.z = 5;

      // Render the scene
      // It is a loop that draw the scene every time the screen is refresed (about 60 times/second)
      this.animate();



    },
    animate() {
      requestAnimationFrame(this.animate);

      // Animate the cube
      this.cube.rotation.x += 0.01;
      this.cube.rotation.y += 0.01;

      this.renderer.render(this.scene, this.camera);
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
  background: cornflowerblue;
}

#countdown {
  background-color: crimson;
  height: 30px;
  color: white;
  text-align: center;
  font-size: 20px;
}
</style>
