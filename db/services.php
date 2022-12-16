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
        'local_ari_sendSystemMessage' => array(
            'classname'   => 'local_ari_external',
            'methodname'  => 'sendSystemMessage',
            'classpath'   => 'local/ari/db/external.php',
            'description' => 'Send a system message.',
            'type'        => 'write',
            'ajax'        => true,
            'loginrequired' => true
        ),
        'local_ari_sendChatMessage' => array(
            'classname'   => 'local_ari_external',
            'methodname'  => 'sendChatMessage',
            'classpath'   => 'local/ari/db/external.php',
            'description' => 'Send a chat message.',
            'type'        => 'write',
            'ajax'        => true,
            'loginrequired' => true
        ),
        'local_ari_get_rule_execution' => array(
            'classname'    => 'local_ari\external\rule',
            'methodname'   => 'get_rule_execution',
            'description' => 'Get rule execution',
            'type'        => 'write',
            'ajax'        => true,
            'loginrequired' => true
        ),
    );

?>