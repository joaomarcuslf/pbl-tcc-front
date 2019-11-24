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

            <v-flex xs2 v-if="showEdit">
              <v-btn
                class="profile-edit"
                text
                dark
                color="deep-gray accent-4"
                @click="view = 'edit'"
                >{{ $t("USERS.LABEL.PROFILE_EDIT") }}</v-btn
              >
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
                      <v-flex pa-1 sm6 v-if="data.name">
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

                <v-flex sm7 xs12 pa-1>
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

                <v-flex sm3 xs12 pa-1 v-if="!showEdit">
                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-flex pa-1 sm12>
                        <h3 class="text--primary">
                          Adicione uma avaliação
                        </h3>
                      </v-flex>
                    </v-flex>
                    <v-flex x12 v-if="user.username !== username">
                      <v-form
                        id="app"
                        class="form form-wrapper elevation-2"
                        ref="recommendationForm"
                        @submit.prevent="onRecommendationSubmit"
                      >
                        <v-select
                          label="Evento que participou"
                          v-model="recommendation.requisite_id"
                          :items="data.grades"
                          item-text="subheading"
                          item-value="id"
                          :rules="[rules.required]"
                        ></v-select>

                        <v-select
                          label="Tópico recomendado"
                          v-model="recommendation.event_id"
                          :items="nonActiveData"
                          item-text="name"
                          item-value="id"
                          :rules="[rules.required]"
                        ></v-select>

                        <div class="justify-end" style="display:flex">
                          <v-btn dark large color="green" type="submit">
                            Adicionar recomendação
                          </v-btn>
                        </div>
                      </v-form>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>

      <v-card
        class="mx-auto"
        v-if="view === 'show' && data.reviews && data.reviews.length"
      >
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs10>
              <p class="display-1 text--primary">
                Notas recebidas
              </p>
            </v-flex>

            <v-flex
              xs12
              sm4
              v-for="review in data.reviews"
              v-bind:key="review.id"
            >
              <div
                style="margin: 5px; padding: 10px; background: rgba(200, 200, 200, .3)"
              >
                <h1 class="headline">
                  {{ review.event.name }}
                </h1>

                <strong style="padding-left: 10px">
                  Areas:
                </strong>
                {{ review.event.areas }}
                <br />
                <strong style="padding-left: 10px">
                  Requisito:
                </strong>
                {{ review.requisite.name }}
                <br />
                <strong style="padding-left: 10px">
                  Nota:
                </strong>
                {{ review.value }}
                <br />
              </div>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>

      <v-card
        class="mx-auto"
        v-if="
          view === 'show' && data.recommendations && data.recommendations.length
        "
      >
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs10>
              <p class="display-1 text--primary">
                Avaliações de outros usuários
              </p>
            </v-flex>

            <v-flex
              xs12
              sm4
              v-for="recommendation in data.recommendations"
              v-bind:key="recommendation.id"
            >
              <div
                style="margin: 5px; padding: 10px; background: rgba(200, 200, 200, .3)"
              >
                <h1 class="headline">
                  <a :href="`/users/${recommendation.author}/show`">
                    {{ recommendation.author }}
                  </a>
                  recomendou em:
                </h1>

                <strong style="padding-left: 10px">
                  Evento:
                </strong>
                {{ recommendation.event.name }}
                <br />
                <strong style="padding-left: 10px">
                  Areas:
                </strong>
                {{ recommendation.event.areas }}
                <br />
                <strong style="padding-left: 10px">
                  Requisito:
                </strong>
                {{ recommendation.requisite.name }}
                <br />
              </div>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>

      <v-card class="mx-auto" v-if="view === 'show'">
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs10>
              <p class="display-1 text--primary">
                Histórico de uso
              </p>
            </v-flex>

            <v-flex xs12 sm6 pa-1 v-if="userEvents && userEvents.length">
              <div
                style="margin: 5px; padding: 10px; background: rgba(200, 200, 200, .3)"
              >
                <div style="display: flex; align-content: center">
                  <v-icon large pa-1>events</v-icon>

                  <h1 class="pl-5 display-1">
                    Esse usuário participou de
                    {{
                      `${userEvents.length} ${
                        userEvents.length > 1 ? "eventos" : "evento"
                      }`
                    }}
                  </h1>
                </div>
              </div>
            </v-flex>

            <v-flex
              xs12
              sm6
              pa-1
              v-if="userRecomendations && userRecomendations.length"
            >
              <div
                style="margin: 5px; padding: 10px; background: rgba(200, 200, 200, .3)"
              >
                <div style="display: flex; align-content: center">
                  <v-icon large pa-1>list</v-icon>

                  <h1 class="pl-5 display-1">
                    Esse usuário já fez
                    {{
                      `${userRecomendations.length} ${
                        userRecomendations.length > 1
                          ? "recomendações"
                          : "recomendação"
                      }`
                    }}
                  </h1>
                </div>
              </div>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>

      <v-form
        id="app"
        v-if="view === 'edit'"
        class="form form-wrapper elevation-2"
        ref="userForm"
        @submit.prevent="onSubmit"
      >
        <v-container fluid>
          <v-layout column>
            <v-layout row>
              <v-flex>
                <h3 class="title-login title is-3 has-text-right">
                  {{ $t("USERS.FORM.PROFILE_TITLE") }}
                </h3>
              </v-flex>
            </v-layout>

            <v-flex>
              <v-text-field
                :label="$t('USERS.LABEL.NAME')"
                v-model="data.name"
                :placeholder="$t('USERS.FORM.NAMEPLACEHOLDER')"
                name="name"
                id="name"
                :rules="[rules.required]"
              ></v-text-field>
            </v-flex>

            <v-flex>
              <v-text-field
                :label="$t('USERS.LABEL.EMAIL')"
                v-model="data.email"
                :placeholder="$t('USERS.FORM.EMAILPLACEHOLDER')"
                name="email"
                id="email"
                :rules="[rules.required, rules.email]"
              ></v-text-field>
            </v-flex>

            <v-flex>
              <v-text-field
                :label="$t('USERS.LABEL.PASSWORD')"
                v-model="data.password"
                :placeholder="$t('USERS.FORM.PASSWORDPLACEHOLDER')"
                name="password"
                id="password"
                type="password"
              ></v-text-field>

              <v-text-field
                :label="$t('USERS.LABEL.PASSWORD_DUPLICATE')"
                v-model="data.password_dupl"
                :placeholder="$t('USERS.FORM.PASSWORDPLACEHOLDER')"
                name="password"
                id="password"
                type="password"
                :rules="[
                  val => val === data.password || $t('GLOBAL_ERROR.PASSWORD'),
                ]"
              ></v-text-field>
            </v-flex>
          </v-layout>

          <v-layout row wrap justify-end>
            <v-btn dark large color="red" @click="view = 'show'">
              {{ $t("USERS.FORM.CANCEL") }}
            </v-btn>

            <v-btn dark large color="blue" type="submit">
              {{ $t("USERS.FORM.SUBMIT") }}
            </v-btn>
          </v-layout>
        </v-container>
      </v-form>
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
  props: ["username", "showEdit"],
  mixins: [ApiClientMixin, ValidationMixin],
  components: {
    LinearStatistic,
    ActionGrid,
  },
  mounted() {
    this.user = this.getUser();

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
      user: {},
      recommendation: {},
      userRecomendations: [],
    };
  },
  computed: {
    activeData: function() {
      return this.data && this.userEvents
        ? this.userEvents.filter(x => x.status !== "close")
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
        ? this.userEvents.filter(x => x.status === "close")
        : [];
    },
  },
  methods: {
    getData: function() {
      const $context = this;

      if (this.username) {
        Promise.all([
          UserService.getData(this.username),
          $context.apiClient.get(`recommendations/${this.username}`),
        ]).then(([resp, userRecomendations]) => {
          $context.data = resp;

          $context.userEvents = resp.eventsIn;

          $context.recommendation = {};
          $context.recommendation.user_id = resp.id;
          $context.recommendation.author = this.user.username;
          $context.userRecomendations = userRecomendations;
        });
      }
    },
    onRecommendationSubmit: function() {
      if (this.$refs.recommendationForm.validate()) {
        this.apiClient.post(`recommendations`, this.recommendation).then(() => {
          this.getData();
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
