/* eslint-disable vue/no-side-effects-in-computed-properties */
<template>
  <user-card :username="username" />
</template>

<script>
import UserCard from "@/components/shared/card/User";

export default {
  components: {
    UserCard,
  },
  data() {
    return {
      username: this.$route.params.username,
    };
  },
};
</script>
