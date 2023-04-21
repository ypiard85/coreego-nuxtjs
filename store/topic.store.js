import { mapActions } from 'vuex'

export default {
  namespaced: true,

  state: {
    topics: [],
    topicSelected: null,
  },

  getters: {
    getTopics(state) {
      return state.topics
    },
    getTopicSelected(state) {
      return state.topicSelected
    },
  },

  mutations: {
    UPDATE_TOPICS(state, topics) {
      state.topics = topics
    },
    UPDATE_TOPIC_SELECTED(state, topic) {
      state.topicSelected = topic
    },
  },

  actions: {
    async setTopics(context, topics) {
      try {
        if(!topics){
          const documentReference = this.$fire.firestore.collection('topics')
          if (documentReference) {
            const documentSnapShot = await documentReference.get()
            const topicsDatas = documentSnapShot.docs.map((topic) => {
              return { ...topic.data(), id: topic.id }
            })
            context.commit('UPDATE_TOPICS', topicsDatas)
          }
        }else{
          context.commit('UPDATE_TOPICS', topics)
        }
      } catch (error) {
        console.log(error)
      }
    },
    setTopicSelected(context, topic) {
      context.commit('UPDATE_TOPIC_SELECTED', topic)
    },
  },
}
