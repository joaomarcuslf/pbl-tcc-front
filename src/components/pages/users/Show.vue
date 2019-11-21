/* eslint-disable vue/no-side-effects-in-computed-properties */
<template>
  <div id="userProfile">
    <v-container>
      <v-card class="mx-auto" v-if="view === 'show'">
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs10>
              <p class="display-2 text--primary">
                {{ $t("USERS.LABEL.PROFILE") }}: {{ username }}
              </p>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>

      <v-card class="mx-auto" v-if="view === 'show' && data.grades">
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12>
              <v-layout row wrap>
                <v-flex sm2 xs12 pa-1>
                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-flex pa-1 sm6>
                        <h3 class="text--primary">
                          {{ $t("USERS.LABEL.NAME") }}:
                        </h3>
                        {{ data.name }}
                      </v-flex>
                      <v-flex pa-1 sm6>
                        <h3 class="text--primary">
                          {{ $t("USERS.LABEL.USERNAME") }}:
                        </h3>
                        {{ data.username }}
                      </v-flex>

                      <v-flex pa-1 sm6>
                        <h3 class="text--primary">
                          {{ $t("USERS.LABEL.EMAIL") }}:
                        </h3>
                        {{ data.email }}
                      </v-flex>
                      <br />
                    </v-flex>
                    <v-flex x12>
                      <linear-statistic
                        title="Notas"
                        :subtitle="`${$t('USERS.LABEL.RATE')}: ${data.rate}`"
                        color="primary"
                        :items="data.grades"
                      />
                    </v-flex>
                  </v-layout>
                </v-flex>

                <v-flex sm8 xs12 pa-1>
                  <action-grid
                    title="Desafios em progresso"
                    :headers="dataHeaders"
                    :data="activeData"
                    hide-headers
                    hide-actions
                  />

                  <br />
                  <br />

                  <action-grid
                    title="Desafios passados"
                    :headers="dataHeaders"
                    :data="nonActiveData"
                    hide-headers
                    hide-actions
                  />
                </v-flex>

                <v-flex sm2 xs12 pa-1>
                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-flex pa-1 sm12>
                        <h3 class="text--primary">
                          {{ $t("USERS.LABEL.COMMENTS") }}:
                        </h3>
                      </v-flex>
                    </v-flex>
                    <v-flex x12>
                      <v-textarea
                        name="input-7-1"
                        label="Adicione um comentário"
                      ></v-textarea>

                      <div class="headline justify-end" style="display:flex">
                        <v-btn dark large color="green">
                          {{ $t("GLOBAL.ADD_COMMENT") }}
                        </v-btn>
                      </div>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import Material from "vuetify/es5/util/colors";

import ApiClientMixin from "@/mixins/ApiClientMixin";
import ValidationMixin from "@/mixins/ValidationMixin";

import LinearStatistic from "@/components/shared/statistic/LinearStatistic";

import ActionGrid from "@/components/shared/list/ActionGrid";

import UserService from "@/services/UserService";

export default {
  mixins: [ApiClientMixin, ValidationMixin],
  components: {
    LinearStatistic,
    ActionGrid,
  },
  mounted() {
    this.getData();
  },
  watch: {
    view: function() {
      this.getData();
    },
  },
  data() {
    return {
      paramsReady: false,
      color: Material,
      globalEvents: [],
      userEvents: [],
      data: {
        email: null,
        password: null,
        username: null,
        name: null,
      },
      errors: [],
      view: "show",
      username: "",
    };
  },
  computed: {
    activeData: function() {
      return this.data && this.userEvents
        ? this.userEvents.filter(x => x.active)
        : [];
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
    nonActiveData: function() {
      return this.data && this.userEvents
        ? this.userEvents.filter(x => !x.active)
        : [];
    },
  },
  methods: {
    getData: function() {
      const $context = this;

      this.username = this.$route.params.username;

      if (this.username) {
        Promise.all([
          UserService.getData(this.username),
          $context.apiClient.get(`events`),
        ]).then(([resp, events]) => {
          $context.data = resp;

          $context.globalEvents = events;

          $context.userEvents = resp.eventsIn;
        });
      }
    },
    onSubmit: function() {
      if (this.$refs.userForm.validate()) {
        this.apiClient
          .put(`users/${this.data.username}`, this.data)
          .then(() => {
            this.view = "show";
          });
      }
    },
  },
};
</script>

<style scoped>
.profile-edit {
  float: right;
}

#area-chart {
  height: 200px;
  width: 100%;
}

.page-name {
  font-size: 2rem;
  font-weight: bold;
  padding: 0 24px;
}
</style>
