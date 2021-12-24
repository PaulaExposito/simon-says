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
  data() {
    return {};
  },
  methods: {
    nextState(action) {
      if (action === 'next')
      	this.$emit('changeState', { state: STATES.GAME_STATE });
			else
      	this.$emit('changeState', { state: STATES.CHOOSE_LEVEL_STATE });
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