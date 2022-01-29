<template>
  <div class="container">
    <h2>Ranking</h2>
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
    <br><br>
    <n-button type="primary" @click="nextState">Volver al menú principal</n-button>
  </div>
</template>

<script>
import { NButton, NTable } from "naive-ui";
import { STATES } from "../../assets/variables";
import { getRankings } from "../firebase";

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
    },
    order(data) {
      let array = [];

      for (const item in data) {
        array.push(data[item]);
      }

      for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
          if (array[j]['points'] > array[j + 1]['points']) {
            let temp = array[j];
            array[j] = array[j + 1];
            array[j + 1] = temp;
          }
        }
      }

      return array.reverse();
    }
  },
  mounted() {
    const tbody = document.querySelector('tbody');

    getRankings()
      .then(data => {
        if (data == null) return;

        let position = 1;
        data = this.order(data);

        if (data.length > 5)
          data = data.slice(0, 5);

        for (const item in data) {
          const username = data[item]['user']
          const level = data[item]['level']
          const points = data[item]['points']

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