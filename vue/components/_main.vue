<template>
    <div>
        <h1>Allgemeines</h1>
        <p>Es folgen ein paar Daten, die sowohl aus der Datenbank, als auch aus den Übergabeparametern entnommen wurden...</p>
        <table class="table">
            <tr>
                <td>Plugin-Name:</td>
                <td>{{getPluginName}}</td>
            </tr>
            <tr>
                <td>Kursmoderation:</td>
                <td>{{isModerator?'ja':'nein'}}</td>
            </tr>
            <tr>
                <td>Kontext-ID:</td>
                <td>{{getContextID}}</td>
            </tr>
            <tr>
                <td>Kursmodul-ID:</td>
                <td>{{getCourseModuleID}}</td>
            </tr>
            <tr>
                <td v-if="show">Kurs:</td>
                <td>{{course}}</td>
            </tr>
            <tr>
                <td v-if="show">Name:</td>
                <td>{{name}}</td>
            </tr>            
            <tr>
                <td v-if="show">Erstellt:</td>
                <td>{{created}}</td>
            </tr>
            <tr>
                <td v-if="show">Modifiziert:</td>
                <td>{{modified}}</td>
            </tr>
            <tr>
                <td>Konfigurationswert:</td>
                <td>{{getConfigValue}}</td>
            </tr>
        </table>
        <h3 v-if="show">Aufgabenstellung:</h3>
        <div v-if="show" v-html="intro"></div>    
    </div>
</template>
<script>

    import Communication from '../scripts/communication';

    export default {
        data: function(){
            return {
                show: false,
                course: 0,
                name: '',
                intro: '',
                name: '',
                created: '',
                modified: ''
            }
        },
        computed: {
            isModerator: function(){
                return this.$store.getters.getModeratorStatus;
            },
            getContextID: function(){
                return this.$store.getters.getContextID;
            },
            getCourseModuleID: function(){
                return this.$store.getters.getCourseModuleID;
            },
            getPluginName: function(){
                return this.$store.getters.getPluginName;
            },
            getConfigValue: function(){
                return this.$store.getters.getConfigValue;
            }
        },
        beforeCreate: async function(){
            try{
                const cmid = this.$store.getters.getCMID;                
                const response = await Communication.webservice('getInfo', {cmid: cmid});
                if(response.success){
                    const obj = JSON.parse(response.data);
                    if(obj.course) this.course = obj.course;
                    if(obj.intro) this.intro = obj.intro;
                    if(obj.timecreated) this.created = obj.timecreated;
                    if(obj.timemodified) this.modified = obj.timemodified;
                    if(obj.name) this.name = obj.name;
                    this.show = true;
                } else {
                    if(response.data){
                        this.$store.commit("showAlert", ["danger", response.data]);
                    } else {
                        this.$store.commit("showAlert", ["danger", 'Konnte Daten aus Datenbank nicht laden']);
                    }                    
                }
            } catch(error){
                console.log(error);
            }         
        }
    }
</script>