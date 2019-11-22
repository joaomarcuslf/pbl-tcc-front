/* eslint-disable vue/no-side-effects-in-computed-properties */
<template>
  <user-card v-if="username" :username="username" :showEdit="true" />
</template>

<script>
import UserCard from "@/components/shared/card/User";

export default {
  components: {
    UserCard,
  },
  data() {
    return {
      username: undefined,
    };
  },
  mounted() {
    const user = this.getUser();

    this.username = user.username;
  },
};
</script>
