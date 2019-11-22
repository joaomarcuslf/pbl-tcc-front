<template>
  <v-slider
    v-model="slider"
    :label="label"
    :thumb-size="24"
    min="0"
    max="100"
    thumb-color="blue"
    thumb-label="always"
  />
</template>

<script>
export default {
  props: ["value", "label"],
  data() {
    return {
      slider: this.value || 0,
    };
  },
  watch: {
    slider: function() {
      this.$emit("change", this.slider);
    },
    value: function() {
      if (this.slider !== this.value) {
        this.slider = this.value;
      }
    },
  },
};
</script>

<style></style>
