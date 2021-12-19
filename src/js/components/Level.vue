<template>
  <div class="container">
    <h2>Elige el nivel</h2>
    <p>TODO: Put a selector of different levels</p>
    <n-button type="primary" @click="nextState('game')">¡JUGAR!</n-button><br>
    <n-button type="primary" @click="nextState('rankings')">Rankings</n-button>
  </div>
</template>

<script>
import { NButton } from "naive-ui";
import { STATES } from "../../assets/variables";

export default {
  name: "Level",
  components: {
    NButton
  },
  data() {
    return {};
  },
  methods: {
    nextState(action) {
      if (action === 'game')
      	this.$emit('changeState', STATES.GAME_STATE);
			else
      	this.$emit('changeState', STATES.RANKINGS_STATE);
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