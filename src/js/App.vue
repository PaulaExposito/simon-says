<template>
  <div class="container">
    <!-- <Game></Game> -->
    <Login v-if="currentState === states.LOGIN_STATE" v-on:logged="setLoggedUser"></Login>
		<Instructions v-else-if="currentState === states.INSTRUCTION_STATE" v-on:changeState="nextState"></Instructions>
		<Level v-if="currentState === states.CHOOSE_LEVEL_STATE" v-on:changeState="nextState"></Level>
		<Game v-if="currentState === states.GAME_STATE" v-on:changeState="nextState"></Game>
		<Ranking v-if="currentState === states.RANKINGS_STATE" v-on:changeState="nextState"></Ranking>
		<Win v-if="currentState === states.WIN_STATE" v-on:changeState="nextState"></Win>
		<Lose v-if="currentState === states.LOSE_STATE" v-on:changeState="nextState"></Lose>
  </div>
</template>

<script>
import Game from "./components/Game.vue";
import Login from "./components/Login.vue";
import Instructions from "./components/Instructions.vue";
import Level from "./components/Level.vue";
import Ranking from "./components/Ranking.vue";
import Win from "./components/Win.vue";
import Lose from "./components/Lose.vue";

import { STATES } from "../assets/variables";

export default {
  name: "App",
  components: {
    Game,
    Login,
    Instructions,
    Level,
    Ranking,
    Win,
    Lose,
  },
  data() {
    return {
      name: "Vue",
      loggedUser: false,
      user: {
        email: "",
        name: "",
      },
      currentState: STATES.LOGIN_STATE,
			states: STATES
    };
  },
  methods: {
    setLoggedUser(user) {
      this.loggedUser = true;
      this.user.email = user.email;
      this.user.name = this.user.email.split("@")[0];
      this.nextState(STATES.INSTRUCTION_STATE);
    },
    nextState(newState) {
      this.currentState = newState;
    },
  },
};
</script>

<style>
.container {
  width: 80%;
  height: 700px;
  background-color: lightgrey;
  overflow: hidden;

  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
