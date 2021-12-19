<template>
  <div class="container">
    <h2>Game</h2>
    <p>TODO: Everything</p>
    <n-button type="primary" @click="nextState('win')">Ganaste</n-button><br>
    <n-button type="primary" @click="nextState('lose')">Perdiste</n-button>
  </div>
</template>

<script>
import { NButton } from "naive-ui";
import { STATES } from "../../assets/variables";

export default {
  name: "Game",
  components: {
    NButton
  },
  data() {
    return {};
  },
  methods: {
    nextState(action) {
      if (action === 'win')
      	this.$emit('changeState', STATES.WIN_STATE);
			else
      	this.$emit('changeState', STATES.LOSE_STATE);
    }
  }
};
</script>

<style>
.container {
  background-color: lightsalmon;
  display: flex;
  flex-direction: column;
}
</style>
