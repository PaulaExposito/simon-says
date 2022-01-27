<template>
  <div class="container">
    <h2>¡Pasas al siguiente nivel!</h2>
    <n-button type="primary" @click="nextState('next')">Seguir jugando</n-button><br>
    <n-button type="primary" @click="nextState('menu')">Volver al menú principal</n-button>
  </div>
</template>

<script>
import { NButton } from "naive-ui";
import { STATES } from "../../assets/variables";

export default {
  name: "Win",
  components: {
    NButton
  },
  props: {
    roundInfo: {
      type: Object,
    }
  },
  data() {
    return {};
  },
  methods: {
    nextState(action) {
      if (action === 'next')
      	this.$emit('changeState', { 
                                    state: STATES.GAME_STATE,
                                    level: this.roundInfo.level, 
                                    round: this.roundInfo.round,  
                                    objects: this.roundInfo.objects,
                                    animations: this.roundInfo.animations,
                                    sequence: this.roundInfo.sequence,
                                    renderer: this.roundInfo.renderer,
                                    colorsIndexSelected: this.roundInfo.colorsIndexSelected,
                                    geometriesSelected: this.roundInfo.geometriesSelected,
                                    scene: this.roundInfo.scene,
                                    camera: this.roundInfo.camera,
                                    light: this.roundInfo.light,
                                    clock: this.roundInfo.clock,
                                  });
			else
      	this.$emit('changeState', { 
                                    state: STATES.CHOOSE_LEVEL_STATE,
                                    sendPuntuation: true,
                                    round: this.roundInfo.round,  
                                    level: this.roundInfo.level, 
                                  });
    }
  }
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
}
</style>