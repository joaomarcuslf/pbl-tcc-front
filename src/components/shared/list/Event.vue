<template>
  <v-card v-if="data.length > 0">
    <v-toolbar card dense color="transparent">
      <v-toolbar-title>
        <h4>{{ title }}</h4>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-card-text class="pa-0">
      <template>
        <v-container fluid style="padding: 0;">
          <v-layout column class="event-wrapper">
            <v-flex
              v-for="(event, index) in data"
              v-bind:key="index"
              @click.prevent="
                headers[0].click ? headers[0].click(event) : false
              "
              :class="{ even: index % 2 === 0 }"
            >
              <div :class="`link-wrapper ${align}`">
                <a
                  :href="`/events/${event.id}`"
                  :style="`font-size: ${size};`"
                  :class="`pa-${padding}`"
                  >{{ event.name }}</a
                >
              </div>

              <div class="chip-wrapper">
                <v-chip
                  primary
                  small
                  size="13"
                  v-for="area in areasToList(event.areas)"
                  v-bind:key="area"
                >
                  {{ area }}
                </v-chip>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </template>
    </v-card-text>
  </v-card>
</template>

<script>
import { uniq } from "lodash";

export default {
  name: "EventList",
  props: {
    title: {
      type: String,
      default: "",
    },
    headers: {
      type: Array,
      default: function() {
        return [];
      },
    },
    data: {
      type: Array,
      default: function() {
        return [];
      },
    },
    rowsPerPageItems: {
      type: Array,
    },
    value: {
      type: Object,
      default: function() {
        return {
          sortBy: null,
          direction: null,
          page: 1,
          rowsPerPage: 25,
        };
      },
    },
    serverSide: {
      type: Boolean,
      default: false,
    },
    hideActions: {
      type: Boolean,
      default: false,
    },
    hideHeaders: {
      type: Boolean,
      default: false,
    },
    totalItems: {
      type: Number,
    },
    align: {
      type: String,
      default: "center",
    },
    size: {
      type: String,
      default: "1.1em",
    },
    padding: {
      type: String,
      default: "0",
    },
  },
  watch: {
    pagination: {
      deep: true,
      immediate: true,
      handler: function(newVal, oldVal = {}) {
        if (newVal.page && oldVal.page && newVal.page !== oldVal.page) {
          this.$emit("changePage", newVal.page);
        }

        this.$emit("input", newVal);
      },
    },
    value: {
      deep: true,
      immediate: true,
      handler: function(newVal) {
        this.pagination = newVal;
      },
    },
  },
  data() {
    return {
      pagination: this.value,
    };
  },
  methods: {
    changeSort(column, sortable = true) {
      if (!this.serverSide) {
        let pagination = Object.assign({}, this.pagination);

        if (sortable) {
          if (pagination.sortBy === column) {
            pagination.direction =
              pagination.direction === "asc" ? "desc" : "asc";
            pagination.descending = !pagination.descending;
          } else {
            pagination.sortBy = column;
            pagination.direction = "asc";
            pagination.descending = false;
          }
        }

        this.pagination = pagination;
      }

      this.$emit("changeSort", column, sortable, this.pagination);
    },
    areasToList: function(areas = "") {
      return areas && uniq(areas.split(","));
    },
  },
};
</script>

<style scoped>
.event-wrapper {
  margin: 0 !important;
}

.even {
  background: rgba(170, 170, 170, 0.2);
}
.chip-wrapper {
  display: flex;
  justify-content: flex-end;
}

.chip-wrapper * {
  font-size: 12px !important;
}

.link-wrapper {
  display: flex;
}

.link-wrapper.center {
  justify-content: center;
}

.link-wrapper.end {
  justify-content: flex-end;
}

.link-wrapper.start {
  justify-content: flex-start;
}

.link-wrapper a {
  font-weight: bold;
}
</style>
