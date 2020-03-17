<?php

    /**
     * 
     * @author Marc Burchart
     * @email marc.burchart@fernuni-hagen.de
     * @version 1.0
     * @description All used AJAX services listed up here.
     * 
    */

    $functions = array(
        'local_ari_sendChatMessage' => array(
            'classname'   => 'local_ari_external',
            'methodname'  => 'sendChatMessage',
            'classpath'   => 'local/ari/db/external.php',
            'description' => 'Send a system message to the user.',
            'type'        => 'write',
            'ajax'        => true,
            'loginrequired' => true
        ),
        'local_ari_sendSystemMessage' => array(
            'classname'   => 'local_ari_external',
            'methodname'  => 'sendSystemMessage',
            'classpath'   => 'local/ari/db/external.php',
            'description' => 'Send a chat message to the user.',
            'type'        => 'write',
            'ajax'        => true,
            'loginrequired' => true
        )
    );

?>