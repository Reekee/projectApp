<?php
    include("config/autoload.php");
    
    $project_id = @$REQUEST->project_id;
    $project_name = @$REQUEST->project_name;
    $project_detail = @$REQUEST->project_detail;
    $project_date = @$REQUEST->project_date;
    $project_amount = @$REQUEST->project_amount;
    $project_image = @$REQUEST->project_image;
    $user_id = @$REQUEST->user_id;
    
    $date = date("Y-m-d H:i:s");

    $project_image_old = $project_image;
    $project_image = str_replace("tmp", "project", $project_image);

    $project_image_before_edit = $DATABASE->QueryString("SELECT project_image FROM project WHERE project_id='".$project_id."'");

    $sql = "
        UPDATE project SET 
            project_name='".$project_name."',
            project_detail='".$project_detail."',
            project_date='".$project_date."',
            project_amount='".$project_amount."',
            project_image='".$project_image."',
            user_id='".$user_id."',
            date='".$date."'
        WHERE project_id='".$project_id."'
    ";
    if( $DATABASE->Query($sql) ) {
        if($project_image_old!="" && file_exists($project_image_old)) {
            if( $project_image_before_edit!=$project_image ) {
                rename($project_image_old, $project_image);
                if(file_exists($project_image_before_edit)) unlink($project_image_before_edit);
            }
        }
        echo json_encode(array(
            "status"=>true,
            "project_image_old"=>$project_image_old,
            "project_image"=>$project_image,
            "project_image_before_edit"=>$project_image_before_edit
        ));
    } else {
        echo json_encode(array(
            "status"=>false,
            "message"=>"ไม่สามารถติดต่อฐานข้อมูลได้"
        ));
    }
