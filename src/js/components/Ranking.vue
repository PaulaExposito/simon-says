<template>
  <div class="container">
    <h2>Ranking</h2>
		<p>TODO: Make a table with Rankings</p>
		<p>TODO: Read data of Realtime Database in Firebase</p>
    <n-button type="primary" @click="nextState">Volver al menú principal</n-button>
  </div>
</template>

<script>
import { NButton } from "naive-ui";
import { STATES } from "../../assets/variables";

export default {
  name: "Ranking",
  components: {
    NButton
  },
  data() {
    return {};
  },
  methods: {
    nextState() {
      this.$emit('changeState', STATES.CHOOSE_LEVEL_STATE);
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