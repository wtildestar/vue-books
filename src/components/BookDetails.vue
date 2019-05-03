<template>
    <v-card color="info" class="white--text">
        <v-container fluid>
            <v-layout row class="hidden-sm-and-down">
                <v-flex xs4 md3>
                   <v-img :src="book.imageUrl" height="150px">
                   </v-img>
                    <div class="text-xs-center">
                        <v-btn flat color="white">
                            <v-icon left>visibility</v-icon> YouTube
                        </v-btn>
                    </div>
                </v-flex>
                <v-flex xs8 md9>
                    <v-card-title>
                        <div>
                            <div class="headline">{{ book.title }}</div>
                            <div>{{ book.description }}</div>
                            <v-divider class="white"></v-divider>
                            <div>Уровень: {{ getBookLevel(book.level) }}, {{ book.parts.length }} частей</div>
                        </div>
                    </v-card-title>
                    <v-card-actions>
                        <!-- <v-rating v-model="book.rating" color="yellow" readonly dense half-increments></v-rating>
                        <div class="ml-1">
                            <span>{{ book.rating }}</span>
                            <span>({{ book.ratingCount }})</span>
                        </div> -->
                        <v-spacer></v-spacer>
                        <v-btn class="primary" flat v-if="canLoadBook(book.id)" @click="loadBook(book.id)">Загрузить</v-btn>
                        <div v-if="getUserDataBook(book.id)">
                            <v-icon color="white">work_outline</v-icon>
                            Книга скачана {{ getBookAddedDate(book.id) | formattedDate }}
                        </div>
                    </v-card-actions>
                </v-flex>
            </v-layout>
            <div class="hidden-md-and-up">
                <v-layout row>
                    <v-flex xs4 md3>
                        <v-img :src="book.imageUrl" height="150px">
                        </v-img>
                    </v-flex>
                    <v-flex xs8 md9>
                        <v-card-title>
                            <div>
                                <h4>{{ book.title }}</h4>
                                    <div class="text-xs-center">
                                    <v-btn flat color="white">
                                        <v-icon left>visibility</v-icon> YouTube
                                    </v-btn>
                                </div>
                            </div>
                        </v-card-title>
                    </v-flex>
                </v-layout>
                <v-layout row>
                    <v-flex xs12>
                        <div>{{ book.description }}</div>
                    </v-flex>
                </v-layout>
                <v-layout row>
                    <v-flex xs12>
                        <div>Уровень: {{ getBookLevel(book.level) }}, {{ book.parts.length }} частей</div>
                    </v-flex>
                </v-layout>
                <v-layout row>
                    <v-flex xs12>
                        <v-card-actions>
                            <!-- <v-rating v-model="book.rating" color="yellow" readonly dense half-increments></v-rating>
                            <div class="ml-1">
                                <span>{{ book.rating }}</span>
                                <span>({{ book.ratingCount }})</span>
                            </div> -->
                            <v-spacer></v-spacer>
                            <v-btn class="primary" flat>Загрузить</v-btn>
                        </v-card-actions>
                    </v-flex>
                </v-layout>
            </div>
        </v-container>
    </v-card>
</template>

<script>
    import * as bookHelper from '../helpers/book'
    import {mapGetters} from 'vuex'
    export default {
        props:{
            "book":{
                type: Object,
                required: true
            }
        },
        data(){
            return {
                loading: false
            }
        },
        computed:{
            ...mapGetters(['isUserAuthenticated','userData','getProcessing']),

        },
        methods:{
            getBookLevel: bookHelper.getBookLevel,
            canLoadBook(bookId){
                let book = this.getUserDataBook(bookId)
                return this.isUserAuthenticated && !this.getProcessing && !book
            },
            getUserDataBook(bookId){
                return this.userData.books[bookId]
            },
            loadBook(bookId){
                this.$store.dispatch('ADD_USER_BOOK', bookId)
            },
            getBookAddedDate(bookId){
                let book = this.getUserDataBook(bookId)
                return book.addedDate
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>