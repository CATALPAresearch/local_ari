//@ts-ignore
import $ from "jquery";

export class Toolbox{
    public static highlight(){
        $(document).ready(
            function(){
                $("h1").css("background-color", "yellow");
            }
        );
    }
}