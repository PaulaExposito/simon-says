<template>
  <div class="container">
    <h2>Instructions</h2>
    <p>TODO: Write the instructions</p>
    <n-button type="primary" @click="nextState">Siguiente</n-button>
  </div>
</template>

<script>
import { NButton } from "naive-ui";
import { STATES } from "../../assets/variables";

export default {
  name: "Instructions",
  components: {
    NButton
  },
  data() {
    return {};
  },
  methods: {
    nextState() {
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