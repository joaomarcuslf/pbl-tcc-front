import ApiClient from "@/services/ApiClient";

const Client = new ApiClient();

const CURRENT_USER_STORAGE = "current_user";

const ANONYMOUS_USER = {
  id: undefined,
  email: undefined,
  name: undefined,
  token: undefined,
  roles: "none",
};

class UserService {
  static setCurrentUser(user = ANONYMOUS_USER) {
    localStorage.setItem(CURRENT_USER_STORAGE, JSON.stringify(user));
  }

  static getCurrentUser() {
    let currentUser = ANONYMOUS_USER;
    let user = localStorage.getItem(CURRENT_USER_STORAGE) || ANONYMOUS_USER;

    try {
      currentUser = JSON.parse(user);
    } catch (error) {
      currentUser = ANONYMOUS_USER;
    }

    return currentUser;
  }

  static async getData(username) {
    let fullResponse = {};
    const user = UserService.getCurrentUser();

    return new Promise(resolve =>
      Promise.all([
        Client.get(`users/${username || user.username}`),
        Client.get(`areas/${username || user.username}`),
      ]).then(([resp, areas]) => {
        fullResponse = resp;
        fullResponse.rate = fullResponse.rate || 1200;

        fullResponse.areas = areas;

        const grades = resp.reviews.reduce((acc, nxt) => {
          if (acc[nxt.requisite.name]) {
            acc[nxt.requisite.name] = {
              value: acc[nxt.requisite.name].value + nxt.value * nxt.weight,
              weight: acc[nxt.requisite.name].weight + nxt.weight,
              id: nxt.requisite.id,
            };
          } else {
            acc[nxt.requisite.name] = {
              value: nxt.value * nxt.weight,
              weight: nxt.weight,
              id: nxt.requisite.id,
            };
          }

          return acc;
        }, {});

        fullResponse.grades = Object.keys(grades).reduce((acc, nxt) => {
          return acc.concat({
            subheading: nxt,
            value: grades[nxt].value / grades[nxt].weight,
            id: grades[nxt].id,
          });
        }, []);

        if (fullResponse.inscriptions) {
          Promise.all(
            fullResponse.inscriptions.map(x =>
              Client.get(`events/${x.event_id}`)
            )
          )
            .then(eventsFromUser => {
              fullResponse.eventsIn = eventsFromUser;
            })
            .then(() => {
              resolve(fullResponse);
            });
        } else {
          fullResponse.eventsIn = [];
          resolve(fullResponse);
        }
      })
    );
  }
}

export default UserService;
