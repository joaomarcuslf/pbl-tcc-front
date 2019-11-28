<template>
  <div id="pageListArea">
    <v-container fluid grid-list-lg>
      <v-card class="mx-auto">
        <v-card-text>
          <v-layout column wrap>
            <v-flex xs10>
              <p class="display-2 text--primary">
                Rank de usuários
              </p>
            </v-flex>
            <v-layout row>
              <v-flex sm6 pa-2>
                <p class="display-1 text--primary">
                  Por evento:
                </p>

                <v-tabs v-model="tab1">
                  <v-tab>
                    Maior nota
                  </v-tab>

                  <v-tab>
                    Maior participação
                  </v-tab>
                </v-tabs>

                <div
                  class="user-list"
                  v-for="(data, index) in tab1 === 0 ? rate : mostInscriptions"
                  v-bind:key="data.user.id"
                  :class="{ even: index % 2 === 0 }"
                >
                  <a :href="`/users/${data.user.username}/show`">
                    <h2 class="display-1">
                      {{ data.user.name || data.user.username }}
                    </h2>
                  </a>

                  <strong>Pontuação no rank: {{ data.count }}</strong>
                </div>
              </v-flex>

              <v-flex sm6 pa-2>
                <p class="display-1 text--primary">
                  Por recomendação:
                </p>

                <v-tabs v-model="tab2">
                  <v-tab>
                    Mais recomendado
                  </v-tab>

                  <v-tab>
                    Mais comentários feitos
                  </v-tab>
                </v-tabs>

                <div
                  class="user-list"
                  v-for="(data, index) in tab2 === 0
                    ? mostRecommendations
                    : mostAuthor"
                  v-bind:key="data.user.id"
                  :class="{ even: index % 2 === 0 }"
                >
                  <a :href="`/users/${data.user.username}/show`">
                    <h2 class="display-1">
                      {{ data.user.name || data.user.username }}
                    </h2>
                  </a>

                  <strong>Pontuação no rank: {{ data.count }}</strong>
                </div>
              </v-flex>
            </v-layout>

            <v-flex xs12>
              <br />
              <hr style="opacity: 0.1; border-raius: 45%;" />
              <br />

              <strong
                class="text--primary"
                style="display: flex; justify-content: center; font-size: 1.5em; flex-wrap: wrap"
              >
                Se motive também! Participe dos eventos e você pode estar na
                próxima listagem de rank!
              </strong>

              <strong
                class="text--primary"
                style="display: flex; justify-content: center; font-size: 1.5em; flex-wrap: wrap"
              >
                <a href="/events/list">Clique aqui para ver mais</a>
              </strong>
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

export default {
  mixins: [ApiClientMixin],
  mounted() {
    this.search();
  },
  data() {
    return {
      tab1: 0,
      tab2: 0,
      paramsReady: false,
      ruleShowAll: false,
      color: Material,
      data: {
        min_length: 5,
      },
    };
  },
  computed: {
    dataToShow: function() {
      const data = [
        this.rate,
        this.mostInscriptions,
        this.mostRecommendations,
        this.mostAuthor,
      ];

      return data[this.tab];
    },
    mostInscriptions: function() {
      let data = [];

      if (this.data.most_inscriptions) {
        for (let i = 0; i < this.data.min_length; i++) {
          data.push(this.data.most_inscriptions[i]);
        }
      }

      return data;
    },
    mostRecommendations: function() {
      let data = [];

      if (this.data.most_recommendations) {
        for (let i = 0; i < this.data.min_length; i++) {
          data.push(this.data.most_recommendations[i]);
        }
      }

      return data;
    },
    mostAuthor: function() {
      let data = [];

      if (this.data.most_author) {
        for (let i = 0; i < this.data.min_length; i++) {
          data.push(this.data.most_author[i]);
        }
      }

      return data;
    },
    rate: function() {
      let data = [];

      if (this.data.rate) {
        for (let i = 0; i < this.data.min_length; i++) {
          data.push(this.data.rate[i]);
        }
      }

      return data;
    },
  },
  methods: {
    search: function() {
      this.apiClient.get("ranks").then(resp => {
        this.data = resp.data;
      });
    },
  },
};
</script>

<style>
#area-chart {
  height: 200px;
  width: 100%;
}

.page-name {
  font-size: 2rem;
  font-weight: bold;
  padding: 0 24px;
}

.v-expansion-panel__container {
  border: 1px solid rgba(250, 250, 250, 0.8);
}

.user-list {
  padding: 5px;
}

.user-list.even {
  background: rgba(150, 150, 150, 0.3);
}

.user-list strong {
  paddign-left: 10px;
}
</style>
