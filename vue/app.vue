<template>
     <div>        
        <transition name="fade">
            
        </transition>
        <ul class="nav nav-tabs nav-vue">
            <li class="nav-item">
                <router-link to="/" class="nav-link">Test-Übersicht</router-link>                
            </li>           
            <li class="nav-item">                
                <router-link to="/unknown" class="nav-link">Unbekannte Seite</router-link>
            </li>    
        </ul>
        <div class="tab-content main-vue">
            <div class="mx-3 mt-4 mb-3">  
                <router-view />
            </div>
        </div>        
    </div>
</template>
<script>
    export default {
        data: function(){
            return {
                myVar:true,
                myVar2:44
            }
        },
        computed: {/*
            alertType: function(){
                return this.$store.getters.getAlertType;
            },
            showAlert: function(){
                return this.$store.getters.getAlertState;
            },
            alertMessage: function(){
                return this.$store.getters.getAlertMessage;
            }*/
        }
    }
</script>