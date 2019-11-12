<?php
    include("config/autoload.php");

    $search = @$REQUEST->search;

    $sql = "
        SELECT * 
        FROM project 
        WHERE project_name LIKE '%".$search."%'
            OR project_detail LIKE '%".$search."%'
            OR project_amount LIKE '%".$search."%'
    ";
    $result = $DATABASE->QueryObj($sql);
    echo json_encode(array(
        "status"=>true,
        "projects"=>$result
    ));
