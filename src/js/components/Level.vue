<template>
  <div class="container">
    <h2>Elige el nivel</h2>

    <n-radio-group v-model:value="value" name="radiogroup">
      <n-space vertical>
        <n-radio v-for="level in levels" :key="level.value" :value="level.value">
          {{ level.label }}
        </n-radio>
      </n-space>
    </n-radio-group>
    <br>
    <n-button type="primary" @click="nextState('game')">¡JUGAR!</n-button><br />
    <n-button type="primary" @click="nextState('rankings')">Rankings</n-button>
  </div>
</template>

<script>
import { NButton, NRadioGroup, NSpace, NRadio } from "naive-ui";
import { STATES } from "../../assets/variables";

export default {
  name: "Level",
  components: {
    NButton,
    NRadioGroup,
    NSpace,
    NRadio
  },
  data() {
    return {
      value: 0,
      levels: [
        {
          label: "Fácil",
          value: 0
        },
        {
          label: "Medio",
          value: 1
        },
        {
          label: "Difícil",
          value: 2
        },
      ]
    };
  },
  methods: {
    nextState(action) {
      if (action === "game") this.$emit("changeState", { state: STATES.GAME_STATE, level: this.value });
      else this.$emit("changeState", { state: STATES.RANKINGS_STATE });
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