import { db, auth } from "~/plugins/firebase.js";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy
} from "firebase/firestore";
import {COLOR_ACTIVITY} from "~/utils/variables"


export default {
  namespaced: true,

  state: {
    cities: null,
    categories: null,
    places: null,
    users: [],
    carnet: null,
  },

  getters: {
    getCities(state) {
      return state.cities;
    },
    getCategories(state) {
      return state.categories;
    },
    getPlaces(state) {
      return state.places;
    },
    getUsers(state) {
      return state.users;
    },
    getCarnet(state) {
      return state.carnet;
    },
  },

  mutations: {
    updatePlaces(state, place) {
      state.places = place;
    },
    updateCategories(state, categories) {
      state.categories = categories;
    },
    updateCities(state, cities) {
      state.cities = cities;
    },
    updatesUsers(state, user) {
      state.users.push(user);
    },
    updateCarnet(state, place) {
      state.carnet = place;
    }
  },

  actions: {
    async loadCarnet(context) {
      if (auth.currentUser) {
        const carnetRef = doc(db, "carnets", auth.currentUser.uid);
        const carnetSnap = await getDoc(carnetRef);
        if (carnetSnap.exists()) {
          context.commit("updateCarnet", carnetSnap.data().places);
        }else{
          context.commit("updateCarnet", []);
        }
      }
    },

    async loadProfil(context, user){
        let docRef  = doc(db, 'profils', user )
        let docSnap  = await getDoc(docRef)
        if(docSnap.exists()){
          return docSnap.data()
        }else{
          return null
        }
    },

    async loadCities(context) {
      const citieRef = collection(db, "cities");
      await getDocs(citieRef)
        .then((docs) => {
          if (!docs) {
            throw new Error("Erreur lors du chargement des villes");
          }

          docs.forEach((doc) => {
            let cities = doc.data().cities.map((city, index) => {
              return {id: index + 1 , label: city}
            })
            cities = cities.sort(function(a,b){
              if(a.label > b.label){
                return 1
              }else if(a.label < b.label){
                return -1
              }
            })

            context.commit("updateCities", cities);
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async loadCategories(context) {
      const categorieRef = collection(db, "categories");
      await getDocs(categorieRef)
        .then((docs) => {
          if (!docs) {
            throw new Error("Erreur lors du chargement des catégories");
          }
          docs.forEach((doc) => {
            let categories = doc.data().names.map((category, index) => {
              return {id: index + 1, label: category, color: COLOR_ACTIVITY[index]}
            })

            categories = categories.sort(function(a,b){
              if(a.label > b.label){
                return 1
              }else if(a.label < b.label){
                return -1
              }
            })

            context.commit("updateCategories", categories);
          });
        })
        .catch((error) => console.log(error));
    },

    async loadPlaces({ commit, state }) {
      let placeRef = query(collection(db, "lieux"), orderBy('updated_at', 'desc') );
      let places = [];
      let docs = await getDocs(placeRef);
      if (!docs) {
        throw new Error("impossible de charger les lieux");
      }
      docs.forEach((place) => {
        places.push({ ...place.data(), id: place.id });
      });
      places = places.map((place) => {
        let user = state.users.find((user) => user.localId === place.user);
        return { ...place, user };
      });
      commit("updatePlaces", places);
    },

    async loadUsers(context) {
      let usersRef = collection(db, "users");
      let docs = await getDocs(usersRef);
      if (!docs) {
        throw new Error("impossible de charger les utilisateurs");
      }

      docs.forEach((user) => {
        context.commit("updatesUsers", user.data());
      });
    },
  },
};
