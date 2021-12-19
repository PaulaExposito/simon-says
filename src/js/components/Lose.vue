<template>
  <div class="container">
    <h2>¡Perdiste! :(</h2>
    <n-button type="primary" @click="nextState">Volver al menú principal</n-button>
  </div>
</template>

<script>
import { NButton } from "naive-ui";
import { STATES } from "../../assets/variables";

export default {
  name: "Lose",
  components: {
    NButton,
  },
  data() {
    return {};
  },
  methods: {
    nextState() {
      this.$emit("changeState", STATES.CHOOSE_LEVEL_STATE);
    },
  },
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
}
</style>