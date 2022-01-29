<template>
  <div class="container">
    <h2>Instrucciones</h2>
    <p>En el juego Simón Dice, intenta memorizar la serie de objetos iluminados y reproducirla, en cada paso se agrega una nueva clave a la serie y el juego se vuelve más difícil. El juego termina cuando el jugador comete el primer error (cuando el jugador presiona el objeto iluminado incorrecto).
El propósito del juego es reproducir las series más largas de colores / sonidos generados aleatoriamente por el juego.
Puedes cambiar el nivel de dificultad del juego</p><br>
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
  color: #cfcfcf;
}

p {
  max-width: 50%;
  text-align: center;
}
</style>