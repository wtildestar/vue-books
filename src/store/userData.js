import Vue from 'vue'
import firebase from 'firebase/app'
import { EventBus } from '../infrastructure/eventBus'
let defaultUserData = {
    books: {},
    words: {}
}
export default {
    state: {
        userData: defaultUserData
    },
    mutations: {
        SET_USER_DATA(state, payload){
            state.userData = payload
        },
        ADD_USER_BOOK(state, payload){
            //делает данные реактивными
            Vue.set(state.userData.books, payload.bookId, payload.book)
        },
        ADD_USER_BOOK_PART(state, payload){
            Vue.set(state.userData.books[payload.bookId].parts, payload.partId, {addedDate: payload.timestamp})
        },
        UPDATE_USER_BOOK_PART_LAST_OPENED_DATE(state, payload){
            Vue.set(state.userData.books[payload.bookId].parts[payload.partId], 'lastOpenedDate', payload.timestamp)
        },
        UPDATE_USER_BOOK_PART_FINISH_INFO(state, payload){
            Vue.set(state.userData.books[payload.bookId].parts[payload.partId], 'finishedDate', payload.timestamp)
            Vue.set(state.userData.books[payload.bookId].parts[payload.partId], 'rating', payload.rating)
        },
        ADD_USER_WORD(state, payload){
            //делает данные реактивными
            Vue.set(state.userData.words, payload.wordId, payload.word)
        },
        REMOVE_USER_WORD(state, payload){
            Vue.delete(state.userData.words, payload)
            EventBus.notify('userword:updated', payload)
        },
        UPDATE_USER_WORD(state, payload){
            Vue.set(state.userData.words[payload.wordId], 'bucket', payload.word.bucket)
            Vue.set(state.userData.words[payload.wordId], 'nextShowDate', payload.word.nextShowDate)
            EventBus.notify('userword:updated', payload.wordId)
        }
    },
    actions:{
        LOAD_USER_DATA({commit}, payload){
            commit('SET_PROCESSING', true)
            let userDataRef = Vue.$db.collection('userData').doc(payload)
            userDataRef.get()
            .then((data) => {
                let userData = data.exists ? data.data() : defaultUserData

                if(!userData.books)
                    userData.books = {}

                if(!userData.words)
                    userData.words = {}

                commit('SET_USER_DATA', userData)
                commit('SET_PROCESSING', false)
            })
            .catch(() => {
                commit('SET_PROCESSING', false)
            })
        },
        ADD_USER_BOOK({commit, getters}, payload){
            commit('SET_PROCESSING', true)
            let userDataRef = Vue.$db.collection('userData').doc(getters.userId)
            let book = {
                addedDate: new Date(),
                parts: {}
            }

            userDataRef.set({
                books: {
                    [payload]: book
                }
            }, {merge: true})
            .then(() => {
                commit('ADD_USER_BOOK', {bookId: payload, book: book})
                commit('SET_PROCESSING', false)
            })
            .catch(() => {
                commit('SET_PROCESSING', false)
            })
        },
        ADD_USER_WORD({commit, getters}, payload){
            commit('SET_PROCESSING', true)
            let userDataRef = Vue.$db.collection('userData').doc(getters.userId)
            let word = {
                origText: payload.origText,
                transText: payload.transText,
                type: payload.type,
                addedDate: new Date(),
                bucket: 1,
                nextShowDate: new Date()
            }

            if(payload.origPrefix)
                word.origPrefix = payload.origPrefix

            userDataRef.set({
                words: {
                    [payload.key]: word
                }
            }, {merge: true})
            .then(() => {
                commit('ADD_USER_WORD', {wordId: payload.key, word: word})
                commit('SET_PROCESSING', false)
            })
            .catch(() => {
                commit('SET_PROCESSING', false)
            })
        },
        UPDATE_USER_BOOK_PART_STATS({commit, getters}, payload){
            let userDataRef = Vue.$db.collection('userData').doc(getters.userId)
            let timestamp = new Date()
            if(!getters.userData.books[payload.bookId].parts[payload.partId]){
                userDataRef.update({
                    [`books.${payload.bookId}.parts.${payload.partId}.addedDate`] : timestamp
                })
                .then(() => commit('ADD_USER_BOOK_PART', {bookId: payload.bookId, partId: payload.partId, timestamp: timestamp} ))
            }

            userDataRef.update({
                [`books.${payload.bookId}.parts.${payload.partId}.lastOpenedDate`] : timestamp
            })
            .then(() => commit('UPDATE_USER_BOOK_PART_LAST_OPENED_DATE', {bookId: payload.bookId, partId: payload.partId, timestamp: timestamp} ))
        },
        FINISH_USER_BOOK_PART({commit, getters}, payload){
            let userDataRef = Vue.$db.collection('userData').doc(getters.userId)
            let timestamp = new Date()

            userDataRef.update({
                [`books.${payload.bookId}.parts.${payload.partId}.finishedDate`] : timestamp,
                [`books.${payload.bookId}.parts.${payload.partId}.rating`] : payload.rating
            })
            .then(() => commit('UPDATE_USER_BOOK_PART_FINISH_INFO',
                {bookId: payload.bookId, partId: payload.partId, timestamp: timestamp, rating: payload.rating} ))
        },
        PROCESS_USER_WORD({commit, getters}, payload){
            let word = getters.userData.words[payload]
            
            let userDataRef = Vue.$db.collection('userData').doc(getters.userId)

            if(word.bucket == 5){
                userDataRef.update({
                    [`words.${payload}`] : firebase.firestore.FieldValue.delete()
                })
                .then(() => commit('REMOVE_USER_WORD', payload))
            }else{
                let nextShowDate = new Date()
                nextShowDate = new Date(nextShowDate.setDate((new Date().getDate() + word.bucket * 2)))
                word.nextShowDate = nextShowDate
                word.bucket++

                userDataRef.set({
                    words:{
                        [payload]: word
                    }
                }, {merge: true})
                .then(() => commit('UPDATE_USER_WORD', {word: word, wordId: payload}))
            }
        }
    },
    getters: {
        userData: (state) => state.userData
    }
}