<template>
  <div class="container">
    <!-- <Game></Game> -->
    <Login v-if="currentState === states.LOGIN_STATE" v-on:logged="setLoggedUser"></Login>
		<Instructions v-else-if="currentState === states.INSTRUCTION_STATE" v-on:changeState="nextState"></Instructions>
		<Level v-if="currentState === states.CHOOSE_LEVEL_STATE" v-on:changeState="nextState"></Level>
		<Game v-if="currentState === states.GAME_STATE" v-on:changeState="nextState" :level=level :roundInfo=roundInfo></Game>
		<Ranking v-if="currentState === states.RANKINGS_STATE" v-on:changeState="nextState"></Ranking>
		<Win v-if="currentState === states.WIN_STATE" v-on:changeState="nextState" :level=level :roundInfo=roundInfo></Win>
		<Lose v-if="currentState === states.LOSE_STATE" v-on:changeState="nextState"></Lose> 

		<!-- <Game :level=0></Game> -->

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
import { postRanking, getRankings } from "./firebase";

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
      level: null,
      user: {
        email: "",
        name: "",
      },
      roundInfo: {},
      currentState: STATES.LOGIN_STATE,
			states: STATES
    };
  },
  methods: {
    setLoggedUser(user) {
      this.loggedUser = true;
      this.user.email = user.email;
      this.user.name = this.user.email.split("@")[0];
      this.nextState({ state: STATES.INSTRUCTION_STATE });
    },
    nextState(args) {
      this.currentState = args.state;
      this.roundInfo = {
        level: args.level, 
        round: args.round,  
        objects: args.objects,
        animations: args.animations,
        sequence: args.sequence,
        renderer: args.renderer,
        colorsIndexSelected: args.colorsIndexSelected,
        geometriesSelected: args.geometriesSelected,
        scene: args.scene,
        camera: args.camera, 
        light: args.light,
        clock: args.clock,
      };

      if (args.sendPuntuation != undefined && args.sendPuntuation == true) {

        console.log("App mounted - nº rounds = " + this.roundInfo.round)
        postRanking(this.user.name, this.roundInfo.round, this.roundInfo.level);
      }

      this.level = args.level;
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
