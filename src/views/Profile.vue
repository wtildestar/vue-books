<template>
    <v-container grid-list-md>
        <v-layout row wrap>
            <v-flex xs12 sm10 offset-sm1>
                <v-tabs v-model="tabMode" color="accent" dark fixed-tabs slider-color="success">
                    <v-tab  ripple>
                        Мои данные
                    </v-tab>
                    <v-tab ripple>
                        Мои книги
                    </v-tab>
                     <v-tab  ripple>
                        Мои слова
                    </v-tab>
                    <v-tab-item  >
                        <user-profile-data></user-profile-data>
                    </v-tab-item>
                    <v-tab-item  >
                        <books-list :onlyUser="true"></books-list>
                    </v-tab-item>
                    <v-tab-item  >
                        <user-profile-words></user-profile-words>
                    </v-tab-item>
                </v-tabs>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import userProfileData from '../components/UserProfileData'
    import userProfileWords from '../components/UserProfileWords'
    import booksList from '../components/BooksList'
    export default {
        data(){
            return {
                tabMode: 'data'
            }
        },
        components:{
            userProfileData,
            userProfileWords,
            booksList
        }
    }
</script>

<style lang="scss" scoped>

</style>