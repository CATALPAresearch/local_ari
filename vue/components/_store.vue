<template>
    <div>
        <h3>Generieren einer Fehlermeldung mithilfe des Vuex-Stores:</h3>
        <div>Meine ID___: {{ $route.params.id }}</div>
        <div class="form-group">                      
            <label for="alertMessage">Die gewünschte Nachricht</label>
            <input type="text" class="form-control" id="alertMessage" aria-describedby="messageHelp" placeholder="Bitte geben Sie eine Nachricht ein..." v-model="message">
            <small id="messageHelp" class="form-text text-muted">Die gewünschte Nachricht, welche als Fehlermeldung ausgegeben werden soll.</small>
        </div>
        <div class="form-group">
            <button type="button" class="btn btn-primary" v-on:click="sendAlert">Absenden</button>
        </div>
    </div>
</template>
<script>
    export default {
        data: function(){
            return {
                message: ''
            }
        },
        methods:{
            sendAlert: function(){
                if(this.message.length <= 0){
                    this.$store.commit("showAlert", ["warning", 'Leere Nachricht...']);
                } else {
                    this.$store.commit("showAlert", ["warning", this.message]);
                }    
                this.message = '';            
            }
        }
    }
</script>