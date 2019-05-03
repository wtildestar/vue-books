<template>
    <v-container grid-list-md>
        <v-layout row wrap>
            <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
                <books-list></books-list>
            </v-flex>
        </v-layout>
    </v-container>
</template>
</template>

<script>
    import BooksList from '../components/BooksList'
    export default {
        components: {
            BooksList
        }
    }
</script>

<style lang="scss" scoped>

</style>