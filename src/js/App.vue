<template>
  <div class="container">
		<!-- <Game></Game> -->
		<Login v-if="state === 'login'" v-on:logged="setLoggedUser"></Login>
		<Instructions v-else-if="state === 'instructions'"></Instructions>
	</div>
</template>

<script>

import Game from './components/Game.vue'
import Login from './components/Login.vue'
import Instructions from './components/Instructions.vue'

export default {
	name: 'App',
	components: {
		Game,
		Login,
		Instructions,
	},
  data() {
    return {
      name: "Vue",
			loggedUser: false,
			user: {
				email: "",
				name: ""
			},
			/// states are: login, instructions, levels, ranking, win, lose, game
			state: "login"
    };
  },
	methods: {
		setLoggedUser(user) {
			console.log("logged!")
			console.log(user)
			this.loggedUser = true;
			this.user.email = user.email;

			this.user.name = this.user.email.split("@")[0];

			this.nextState("instructions");

			console.log(this.user.name)
			console.log(this.user.email)
		},
		nextState(newState) {
			this.state = newState;
		}
	}
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
