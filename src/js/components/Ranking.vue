<template>
  <div class="container">
    <h2>Ranking</h2>
		<p>TODO: Order the rankings</p>

    <n-table>
      <thead>
        <tr>
          <th>Puesto</th>
          <th>Usuario</th>
          <th>Nivel</th>
          <th>Puntos</th>
        </tr>
      </thead>
      <tbody></tbody>
    </n-table>

    <br>
    <n-button type="primary" @click="nextState">Volver al menú principal</n-button>
  </div>
</template>

<script>
import { NButton, NTable } from "naive-ui";
import { STATES } from "../../assets/variables";
import { postRanking, getRankings } from "../firebase";

export default {
  name: "Ranking",
  components: {
    NButton,
    NTable
  },
  data() {
    return {
      level: {
        0: "Fácil",
        1: "Medio",
        2: "Difícil"
      }
    };
  },
  methods: {
    nextState() {
      this.$emit('changeState', { state: STATES.CHOOSE_LEVEL_STATE });
    }
  },
  mounted() {
    const tbody = document.querySelector('tbody');

    getRankings()
      .then(data => {
        console.log('rankings')
        if (data == null) return;

        let position = 1;

        for (const user in data) {
          for (const item in data[user]) {
            const username = data[user][item]['user']
            const level = data[user][item]['level']
            const points = data[user][item]['points']

            const tr = document.createElement('tr');
            const tdPosition = document.createElement('td');
            tdPosition.textContent = position++;
            tr.appendChild(tdPosition);
            const tdUsername = document.createElement('td');
            tdUsername.textContent = username;
            tr.appendChild(tdUsername);
            const tdLevel = document.createElement('td');
            tdLevel.textContent = this.level[level];
            tr.appendChild(tdLevel);
            const tdPoints = document.createElement('td');
            tdPoints.textContent = points;
            tr.appendChild(tdPoints);
            tbody.appendChild(tr);
          }

        }

      })
      .catch(err => console.log(err));
  }
  
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
}
</style>