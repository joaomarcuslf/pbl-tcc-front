<template>
  <v-card>
    <v-card-text class="pa-1">
      <div>
        <h5 class="sub-progress">{{ subtitle }}</h5>
      </div>
      <br />
      <div v-for="(item, index) in items" v-bind:key="index">
        <strong>{{ item.subheading }}:</strong>

        {{ item.value }}

        <v-progress-linear
          :value="item.value"
          height="5"
          :color="item.value > 50 ? 'green' : 'red'"
        ></v-progress-linear>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    icon: String,
    title: String,
    subtitle: String,
    value: Number,
    color: String,
    items: Array,
  },
  computed: {
    caption() {
      return this.value + "% " + this.subtitle;
    },
  },
};
</script>
<style scoped>
.sub-progress {
  font-size: 15px;
}
</style>
