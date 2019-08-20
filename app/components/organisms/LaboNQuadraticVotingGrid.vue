<template>
  <form class="qv-form" @keypress.enter.prevent>
    <table>
      <thead>
        <tr>
          <th v-for="column in columns">
            {{ column.text }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="record in records">
          <td v-for="column in columns">
            <span v-if="column.key === 'record_header'">
              {{ record.text }}
            </span>
            <span v-else-if="column.key === 'voting'">
              <vue-numeric-input
                v-model="votedValues[record.option]"
                class="client-input"
                :min="0"
                :max="10"
                :value="0"
                :name="record.option"
                @change="checkRemainingCredit"
              />
            </span>
            <span v-else>
              {{ votedValues[record.option] ** 2 }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </form>
</template>

<script>
import VueNumericInput from 'vue-numeric-input'

export default {
  components: {
    VueNumericInput
  },
  props: {
    records: Array,
    columns: Array,
    votedValues: Object,
    remainingCredit: Number
  },
  methods: {
    checkRemainingCredit(newValue) {
      console.log(newValue)
    }
  }
}
</script>

<style lang="scss" scoped>
body {
  font-family: Helvetica Neue, Arial, sans-serif;
  font-size: 14px;
  color: #444;
}

table {
  border: 2px solid #0086cc;
  border-radius: 3px;
  background-color: #fff;
}

th {
  background-color: #0086cc;
  color: #fff;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

td {
  background-color: #f9f9f9;
  text-align: center;
}

th,
td {
  min-width: 120px;
  padding: 10px 20px;
}

@media screen and (max-width: 1024px) {
  th,
  td {
    min-width: 120px;
    padding: 35px 20px;
  }
}

@media screen and (max-width: 920px) {
  th,
  td {
    min-width: 1rem;
    padding: 10px 20px;
  }
}

@media screen and (max-width: 414px) {
  th,
  td {
    min-width: 2rem;
    padding: 10px 13px;
  }
}

@media screen and (max-width: 320px) {
  th,
  td {
    min-width: 2rem;
    padding: 7px 8px;
  }
}
</style>
