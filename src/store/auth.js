/* eslint-disable no-unused-vars */
import firebase from "firebase/app";

export default {
  actions: {
    async login({ dispatch, commit }, { email, password }) {
      try {
        return await firebase
          .auth()
          .signInWithEmailAndPassword(email, password);
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async register({ dispatch, commit }, { email, password, name }) {
      try {
        await firebase.auth().createUserWithEmailAndPassword(email, password);
        const uid = await dispatch("getUid");
        await firebase
          .database()
          .ref(`/users/${uid}/info`)
          .set({
            bill: 10000,
            name
          });
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    getUid() {
      const user = firebase.auth().currentUser;
      return user ? user.uid : null;
    },
    async logout({ dispatch, commit }) {
      try {
        const result = await firebase.auth().signOut();
        commit("clearInfo");
        return result;
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    }
  }
};
