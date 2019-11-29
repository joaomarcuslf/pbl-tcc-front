<template>
  <v-toolbar class="menu" color="blue darken-3" fixed dark app>
    <v-toolbar-title class="ml-0 pl-3 hidden-md-and-up">
      <v-toolbar-side-icon
        @click.stop="handleDrawerToggle"
      ></v-toolbar-side-icon>
    </v-toolbar-title>

    <a
      class="display-1 pa-2"
      style="color:rgb(250, 250, 250);width: 135px;display: flex;justify-content: center;max-height: 100px;"
      href="/resume"
    >
      <img
        src="@/assets/img/logo.png"
        class="logo"
        alt="Logo da aplicação: Junta Ae"
        style="min-width: 135px"
      />
    </a>

    <v-select
      v-model="search"
      :items="areas"
      append-outer-icon="search"
      hide-details
      dark
      label="Busque eventos por área"
      class="search-field hidden-sm-and-down"
      @change="selectArea"
    ></v-select>

    <v-list class="horizontal-list pa-1 hidden-sm-and-down">
      <v-list-tile
        v-for="(item, index) in items"
        v-show="item"
        :disabled="item.disabled"
        :key="index"
        :target="item.target"
        :to="item.path ? item.path : null"
        @click="item.click ? item.click : true"
        rel="noopener"
        ripple="ripple"
        style="background: transparent"
      >
        <v-list-tile-action v-if="item.action">
          <v-icon>{{ item.action }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ item.text }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-toolbar>
</template>
<script>
import ApiClientMixin from "@/mixins/ApiClientMixin";

export default {
  mixins: [ApiClientMixin],
  props: {
    items: {
      type: Array,
      default: function() {
        return [];
      },
    },
  },
  data() {
    return {
      areas: [],
      search: "",
    };
  },
  mounted() {
    this.apiClient.get(`areas`).then(resp => {
      this.areas = resp.data;
    });
  },
  methods: {
    handleDrawerToggle() {
      window.getApp.$emit("APP_DRAWER_TOGGLED");
    },
    selectArea() {
      this.$router.push(`events/area/${this.search}`);
    },
  },
};
</script>

<style>
.menu {
  padding-left: 0px !important;
}

.horizontal-list {
  display: flex;
  flex: 1;
  justify-content: flex-end;
  background: transparent !important;
}

.horizontal-list .v-list__tile__action {
  display: flex;
  justify-content: center;
}

.flags {
  min-width: 30px;
  max-width: 30px;
}
.flag-title {
  height: 100%;
  padding: 0 12px !important;
  align-items: center;
  display: flex;
}

.horizontal-list.v-list div a.v-list__tile--link.theme--dark:hover {
  background: rgba(245, 245, 245, 0.15) !important;
}

.horizontal-list .v-list__tile--active {
  color: rgba(255, 255, 255, 0.7) !important;
  caret-color: rgba(255, 255, 255, 0.7) !important;
}

.search-field {
  flex: 9;
  padding-left: 24px;
  width: 100%;
}

.search-field .primary--text {
  color: #fafafa !important;
  caret-color: #fafafa !important;
}

.search-field {
  height: 100%;
}
</style>
