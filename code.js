var readline = require('readline');
var rl = readline.createInterface({ 
    input:process.stdin,
    output:process.stdout
});

var arr = {};

for(var i = 0; i < 10; i++){
    arr[i] = {};
    for(var j = 0; j < 10; j++){
        arr[i][j] = 0
    }
}

function random(){
    var x = Math.ceil(Math.random()*10);
    var z = Math.ceil(Math.random()*10);
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

random();
while(true){
    rl.on('line', function(line){ 
        
    })
}
