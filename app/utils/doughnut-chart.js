import { Doughnut } from 'vue-chartjs'

export default {
  extends: Doughnut,
  props: ['data', 'options'],
  watch: {
    data() {
      this.renderChart(this.data, this.options)
    },
    options() {
      this.renderChart(this.data, this.options)
    }
  }
}
