<template>
  <v-app id="pageDashboard" v-if="paramsReady">
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex sm2 justify-end class="hidden-xs-only" v-if="canShow(['user'])">
          <h1 class="headline">
            Seu resumo:
          </h1>
          <linear-statistic
            :title="$t('USERS.LABEL.GRADES')"
            :subtitle="`${$t('USERS.LABEL.RATE')}: ${userData.rate}`"
            color="primary"
            :items="userData.grades"
          />
          <event-list
            title="Eventos recomendados:"
            :headers="dataHeaders"
            :data="recommendedEvents"
            hide-headers
            hide-actions
          />
        </v-flex>

        <v-flex
          sm2
          justify-end
          class="hidden-xs-only"
          v-if="canShow(['manager'])"
        >
          <event-list
            v-if="userData.events && userData.events.length > 0"
            :title="$t('USERS.LABEL.EVENTS_OWN')"
            :headers="dataHeaders"
            :data="userData.events"
            hide-headers
            hide-actions
          />
        </v-flex>

        <v-flex pa-2 sm8 xs12>
          <v-layout column>
            <v-flex>
              <v-tabs v-model="tab">
                <v-tab>
                  Todos
                </v-tab>

                <v-tab v-for="area in areasAll" v-bind:key="area">
                  {{ area }}
                </v-tab>
              </v-tabs>
              <div class="event-overflow">
                <v-expansion-panel color="gray" multiple>
                  <v-expansion-panel-content
                    v-for="event in allEvent"
                    multiple
                    :key="event.id"
                    v-show="
                      event.active &&
                        eventCanShow(areasAll[tab - 1], event.areas)
                    "
                  >
                    <template v-slot:header>
                      <event-top :event="event" :navigateFn="navigateToArea" />
                    </template>

                    <event-card :event="event" :showExpand="true" />
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </div>
            </v-flex>
          </v-layout>
        </v-flex>

        <v-flex
          sm2
          class="hidden-xs-only"
          v-if="
            canShow(['manager', 'admin']) ||
              !(userData.eventsIn && userData.eventsIn.length > 0)
          "
        >
          <h2 class="headline">{{ $t("AREAS.LABEL.QUICK_REFERENCE") }}</h2>

          <a
            v-for="area in areasAll"
            :href="`events/area/${area}`"
            v-bind:key="area"
            style="display: block"
            >- {{ area }}</a
          >
        </v-flex>

        <v-flex sm2 class="hidden-xs-only" v-if="canShow(['user'])">
          <event-list
            v-if="userData.eventsIn && userData.eventsIn.length > 0"
            :title="$t('USERS.LABEL.EVENTS_IN')"
            :headers="dataHeaders"
            :data="userData.eventsIn"
            hide-headers
            hide-actions
          />
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import "vuetify/dist/vuetify.min.css";
import Material from "vuetify/es5/util/colors";

import ApiClientMixin from "@/mixins/ApiClientMixin";
import LinearStatistic from "@/components/shared/statistic/LinearStatistic";

import UserService from "@/services/UserService";
import EventCard from "@/components/shared/card/Event";
import EventTop from "@/components/shared/card/EventTop";
import EventList from "@/components/shared/list/Event";
import { uniq } from "lodash";

export default {
  mixins: [ApiClientMixin],
  components: {
    LinearStatistic,
    EventCard,
    EventTop,
    EventList,
  },
  mounted() {
    const $context = this;

    Promise.all([
      $context.apiClient.get(`events`),
      $context.apiClient.get(`areas`),
    ]).then(([eventsAll, areasAll]) => {
      return UserService.getData().then(userData => {
        this.allEvent = eventsAll;
        this.areasAll = uniq(areasAll.data);
        this.userData = userData;

        this.paramsReady = true;
      });
    });
  },
  data() {
    return {
      color: Material,
      paramsReady: false,
      allEvent: [],
      areasAll: [],
      userData: [],
      areasUser: {},
      tab: 0,
    };
  },
  computed: {
    recommendedEvents: function() {
      const areas =
        this.userData.areas && this.userData.areas.data
          ? Object.keys(this.userData.areas.data).join(",")
          : "";

      return this.allEvent.filter(event => {
        return !this.userIn(event) && this.eventCanShow(areas, event.areas);
      });
    },
    dataHeaders: function() {
      return [
        {
          name: "name",
          text: "Eventos",
          align: "left",
          sortable: false,
          customTemplate: props => {
            return `<a href="/events/${props.id}">${props.name}</a>`;
          },
          click: props => {
            this.$router.push(`/events/${props.id}`);
          },
        },
      ];
    },
  },
  methods: {
    eventCanShow: function(areas = "", area = "") {
      if (areas) {
        return area.split(",").some(area => areas.includes(area));
      }

      return true;
    },
    navigateToArea: function(name) {
      this.$router.push(`/events/area/${name}`);
    },
    userIn: function(event) {
      return this.userData.eventsIn.some(e => {
        return e.id === event.id;
      });
    },
  },
};
</script>

<style scoped>
#area-chart {
  height: 200px;
  width: 100%;
}

.page-name {
  font-size: 2rem;
  font-weight: bold;
  padding: 0 24px;
}

.event-overflow {
  max-height: 710px;
  overflow-y: auto;
}
</style>
