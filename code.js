// var readline = require('readline');
// var rl = readline.createInterface({ 
//     input:process.stdin,
//     output:process.stdout
// });

var arr = [];

for(var i = 0; i < 10; i++){
    arr[i] = [];
    for(var j = 0; j < 10; j++){
        arr[i][j] = 0
    }
}

function random(){
    var x = Math.ceil(Math.random()*10) - 1;
    var z = Math.ceil(Math.random()*10) - 1;
    var index = Math.ceil(Math.random()*2);
    if(arr[x][z] == 0){
        arr[x][z] = index;
    }else{
        random()
    }
}
function render(){
    for(var i = 0; i < 10; i++){
        var str = '';
        for(var j = 0; j < 10; j++){
            str = str + arr[i][j] + "\t";
        }
        console.log(str);
    }
    console.log('-------------------------------------------------------------------------------------');
}

function moveToLeft(){
    for(var i = 0; i < 10; i++){
        var tmp = [0,0,0,0,0,0,0,0,0,0];
        tmp_index = -1;
        for(var j = 0; j < 10; j++){
            if(arr[i][j] != 0){
                tmp_index = tmp_index + 1;
                tmp[tmp_index] = arr[i][j];
            }
        }
        //render();
        add(tmp);
        for(var j = 0; j < 10; j++){
            arr[i][j] = tmp[j];
        }
    }
}
function moveToRight(){
    for(var i = 0; i < 10; i++){
        var tmp = [0,0,0,0,0,0,0,0,0,0];
        tmp_index = -1;
        for(var j = 9; j >= 0; j--){
            if(arr[i][j] != 0){
                tmp_index = tmp_index + 1;
                tmp[tmp_index] = arr[i][j];
            }
        }
        add(tmp);
        for(var j = 0; j < 10; j++){
            arr[i][j] = tmp[9-j];
        }
    }
}
function moveToDown(){
    for(var i = 0; i < 10; i++){
        var tmp = [0,0,0,0,0,0,0,0,0,0];
        tmp_index = -1;
        for(var j = 9; j >= 0; j--){
            if(arr[j][i] != 0){
                tmp_index = tmp_index + 1;
                tmp[tmp_index] = arr[j][i];
            }
        }
        add(tmp);
        for(var j = 0; j < 10; j++){
            arr[j][i] = tmp[9-j];
        }
    }
}
function moveToUp(){
    for(var i = 0; i < 10; i++){
        var tmp = [0,0,0,0,0,0,0,0,0,0];
        tmp_index = -1;
        for(var j = 0; j < 10; j++){
            if(arr[j][i] != 0){
                tmp_index = tmp_index + 1;
                tmp[tmp_index] = arr[j][i];
            }
        }
        add(tmp);
        for(var j = 0; j < 10; j++){
            arr[j][i] = tmp[j];
        }
    }
}
function add(arr){ 
    var index = 0;
    while(index < 9){
        if(arr[index] == arr[index+1]){
            arr[index] = arr[index] * 2;
            arr[index+1] = 0;
            // console.log(arr);
        }
        index = index + 1;
    }
    //console.log(arr);
    var tmp = [0,0,0,0,0,0,0,0,0,0];
    var tmp_index = -1;
    for(var i = 0; i < 10; i++){
        if(arr[i] != 0){
            tmp_index = tmp_index + 1;
            tmp[tmp_index] = arr[i];
            //console.log(tmp);
        }
    }
    for(var i = 0; i < 10; i++){
        arr[i] = tmp[i];
    }
}

for(var j = 0; j < 20; j++){
    random();
}
render();
// moveToRight();
// moveToDown();
moveToUp();
render();

// var asd = [1,2,2,1,1,4,0,0,0,0];
// add(asd);
// console.log(asd);