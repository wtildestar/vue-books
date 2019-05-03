<template>
    <div>
 <v-container fluid grid-list-md>
     <span class="display-1">Слова</span>
    <v-data-iterator
      :items="words"
      :rows-per-page-items="rowsPerPageItems"
      :pagination.sync="pagination"
      :hide-actions="true"
      content-tag="v-layout"
      row
      wrap
    >
      <template v-slot:item="props">
        <v-flex
          xs12
          sm6
          md6
          lg6
        >
          <v-card>
            <v-card-title>
				<div class="headline">{{ getFullOriginalWord(props.item) }}</div>
			</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <div class="headline">
					<v-tooltip bottom>
						<v-avatar slot="activator" v-if="props.item.type == 1" color="teal" size="45">
							<span class="white--text">W</span>
						</v-avatar>
						<span>Слово / das Wort</span>
					</v-tooltip>
					<v-tooltip bottom>
					<v-avatar slot="activator" v-if="props.item.type == 2" color="indigo" size="45">
						<span class="white--text">RW</span>
					</v-avatar>
					<span>Выражение / die Redewendung</span>
					</v-tooltip>
					{{ getFullOriginalWord(props.item) }}
				</div>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                   <v-btn fab dark small color="primary" @click="addWord(props.item)" :disabled="checking">
                        <v-icon dark>add</v-icon>
                    </v-btn>
					<v-snackbar v-model="snackbar" bottom light color="error">	
						<v-icon>warning</v-icon> {{ snackbarText }}
					</v-snackbar>
            </v-card-actions>
             </v-card>
        </v-flex>
      </template>
    </v-data-iterator>
  </v-container>
    </div>
</template>

<script>
	import { getFullOriginalWord } from '../helpers/words'
	
    export default {
        props:{
            "data":{
                type: Object,
                required: true
            }
        },
        computed:{
			words(){
				if(!this.data) return []

				let words = []

				for(var prop in this.data){
					if(this.data.hasOwnProperty(prop)){
						let word = this.data[prop]
						word.key = prop
						words.push(word)
					}
				}

				return words
			}
        },
        data(){
            return {
                rowsPerPageItems: [4, 8, 12],
                pagination: {
                    rowsPerPage: 4
								},
								snackbar: false,
								snackbarText: null,
								checking: false
            }
		},
		methods:{
			getFullOriginalWord: getFullOriginalWord,
			addWord(entity){
				this.checking = true
				let userWords = this.$store.getters.userData.words
				let wordAdded = userWords[entity.key]
				if(wordAdded)
				{
					this.snackbar = true
					this.snackbarText = 'Вы уже добавили это слово для изучения'
				}
				else if(Object.keys(userWords).length > 100)
				{
					this.snackbar = true
					this.snackbarText = 'Вы уже добавили максимальное кол-во слов(100)'
				}else{
					this.$store.dispatch('ADD_USER_WORD', entity)
				}
				this.checking = false
			}
		}
    }
</script>

<style lang="scss" scoped>

</style>