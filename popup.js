// variable declare
var NUM_OF_POINTS = 9;
var NUM_OF_COL = 3;
var STAGE_NAME = "popUpStage";
var IMG_SIZE = 130;
var stage;
var is_click_able = true;
var STAGE_WIDTH = 500;
var STAGE_HEIGHT = 300;
var button_img_data={
    images: ["buttonImg.jpg"],
    frames:[
        [45, 30, IMG_SIZE, IMG_SIZE],
        [205, 30, IMG_SIZE, IMG_SIZE],
        [365, 30, IMG_SIZE, IMG_SIZE]
    ],
    animations:{
        opened: 0,
        selected: 1,
        unopened: 2,
        ableToOpen: {
            frames:[0,1],
            speed: 0.05
        }
    }
};
var CLEARED_STAGE_INDEX = -1;

var spriteSheet = new createjs.SpriteSheet(button_img_data);

// class declare

function point() {
    this.x_coordinate = 0;
    this.y_coordinate = 0;
    this.point_index = 0;
    this.is_clickable = false;
    this.is_clicked = false;
    // 0 to unopened, 1 to opened, 2 to selected
    this.point_status = 0;
}

function line() {
    this.color = "#CCEEFF";
    this.is_clear = false;
}

function windowOpen(event) {
    // console.log(event.target);
    var clicked_button_object = event.target;
    if (is_click_able && clicked_button_object.unit_status.is_clickable) {
        is_click_able = false;
        var popUpWindow = document.getElementById("popUpWindow");
        popUpWindow.classList.remove("hidden");
        clicked_button_object.unit_status.is_clicked = true;
        //popup();
    }
}

function closeWindow() {
    is_click_able = true;
    var popUpWindow = document.getElementById("popUpWindow");
    popUpWindow.classList.add("hidden");
}

function clearStage() {
//    do next thing
    var clicked_child_index = -1;
    var stage_obj_list = filter_button_index_list();
    for (var i = 0; i < stage_obj_list.length; i++) {
        if (stage.children[stage_obj_list[i]].unit_status.is_clicked) {
            clicked_child_index = stage_obj_list[i];
            break;
        }
    }
    if (clicked_child_index === -1) {
        alert("nonono");
    } else {
        if ((CLEARED_STAGE_INDEX + 1) === clicked_child_index) {
            CLEARED_STAGE_INDEX++;
        }
        stage.children[clicked_child_index].unit_status.is_clicked = false;
    }
    closeWindow();
}

function find_button_child_index(_index) {
    var stage_child_list = stage.children;
    var child_index = -1;
    for (var i = 0; i < stage_child_list.length; i++) {
        if (stage_child_list[i].is_button && stage_child_list[i].unit_status.point_index === _index) {
            child_index = i;
            break;
        }
    }
    //if not found, return -1
    return child_index;
}

function filter_button_index_list() {
    var button_list = [];
    for (var i = 0; i < NUM_OF_POINTS; i++) {
        var found_index = find_button_child_index(i);
        if (found_index !== -1) {
            button_list.push(found_index);
        }
    }
    return button_list;
}

function update_button_status() {
    var child_button_index_list = filter_button_index_list();
    for (var i = 0; i < child_button_index_list.length; i++) {
        var child_obj_index = child_button_index_list[i];
        if (child_obj_index === -1) {
            continue;
        }
        if (child_obj_index <= CLEARED_STAGE_INDEX) {
            stage.children[child_obj_index].unit_status.is_clickable = true;
            stage.children[child_obj_index].unit_status.point_status = 1;
        }
        if (child_obj_index === (CLEARED_STAGE_INDEX + 1)) {
            stage.children[child_obj_index].unit_status.is_clickable = true;
            if (stage.children[child_obj_index].unit_status.point_status !== 2) {
                stage.children[child_obj_index].unit_status.point_status = 2;
                stage.children[child_obj_index].gotoAndPlay("ableToOpen");
            }
        }
        switch (stage.children[child_obj_index].unit_status.point_status) {
            case 0 :
                stage.children[child_obj_index].gotoAndPlay("unopened");
                break;
            case 1 :
                stage.children[child_obj_index].gotoAndPlay("opened");
                break;
        }
    }

}

function handleTick(event) {
    update_button_status();
    stage.update(event);
}

function init() {
    stage = new createjs.Stage(STAGE_NAME);
    STAGE_WIDTH = document.getElementById(STAGE_NAME).width;
    STAGE_HEIGHT = document.getElementById(STAGE_NAME).height;

    for (var i = 0; i < NUM_OF_POINTS; i++) {
        var childPoint = new createjs.Sprite(spriteSheet, "unopened");
        childPoint.unit_status = new point();
        childPoint.unit_status.point_index = i;
        childPoint.unit_status.x_coordinate = i % NUM_OF_COL;
        childPoint.unit_status.y_coordinate = Math.floor(i / NUM_OF_COL);
        var box_size = STAGE_WIDTH * 0.1;
        childPoint.scaleX = box_size / IMG_SIZE;
        childPoint.scaleY = box_size / IMG_SIZE;
        childPoint.addEventListener("click", windowOpen);
        childPoint.is_button = true;
        stage.addChild(childPoint);
    }

    var width_itor = Math.floor(STAGE_WIDTH * 0.3);
    var width_margin = Math.floor(STAGE_WIDTH * 0.05);
    var height_itor = Math.floor(STAGE_HEIGHT * 0.3);
    var height_margin = Math.floor(STAGE_HEIGHT * 0.05);

    for (var i = 0; i < stage.children.length; i++) {
        var child_obj_index = find_button_child_index(i);
        if (child_obj_index === -1) {
            continue;
        }
        //convert x and y
        stage.children[child_obj_index].x = (stage.children[child_obj_index].unit_status.x_coordinate * width_itor ) + width_margin;
        stage.children[child_obj_index].y = (stage.children[child_obj_index].unit_status.y_coordinate * height_itor ) + height_margin;
    }

    createjs.Ticker.addEventListener("tick", handleTick);
    createjs.Ticker.setFPS(50);
}