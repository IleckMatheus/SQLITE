window.addEventListener('load', carregado);

var db = openDatabase("BDAMOR", "1.0", "DATABASEAMOR", 2 * 1024 * 1024);



function carregado(){    
    
    document.getElementById('btn-salvar').addEventListener('click', salvar);
    document.getElementById('btn-deletar').addEventListener('click', deletar);
    
    db.transaction(function(tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS TableAmor ( id INTEGER PRIMARY KEY,nome TEXT,temp TEXT, relacao TEXT)" );

    });
    
    mostrar();
    
}   

function salvar(){
    var id = document.getElementById('field-id').value; 
    var nome = document.getElementById('field-name').value;
    var tempo = document.getElementById('field-temp').value;
    var mandar = document.getElementById('field-relacao').value;

    db.transaction(function(tx) {
        if(id){
            tx.executeSql('UPDATE TableAmor SET nome=?, temp=?, relacao=? WHERE id=?', [nome,tempo,mandar,id],null);
        }else{
            tx.executeSql('INSERT INTO TableAmor ( nome,temp,relacao) VALUES (?, ?, ?)', [nome,tempo,mandar]);
        }
    });

    mostrar();
    limpaCampo();
    inputSHOW(false);
}

function mostrar(){        
    var table = document.getElementById('tbody-register');

    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM TableAmor', [], function (tx, resultado) {
            var rows = resultado.rows;
            var tr = '';
            for(var i = 0; i < rows.length; i++){
                    tr += '<tr>';
                    tr += '<td onClick="atualizar(' + rows[i].id + ')">' + rows[i].nome + '</td>';
                    tr += '<td>' + rows[i].temp + '</td>';
                    tr += '<td>' + rows[i].relacao + '</td>';
                    tr += '</tr>';                   
            }
                table.innerHTML = tr; 

        }, null);
    });
}

function atualizar(_id){   
    
    var id = document.getElementById('field-id');
    var nome = document.getElementById('field-name');
    var tempo = document.getElementById('field-temp');
    var mandar = document.getElementById('field-relacao');
    
    id.value = _id;
    
    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM TableAmor WHERE id=?', [_id], function (tx, resultado) {
            var rows = resultado.rows[0];

            nome.value = rows.nome ;
            tempo.value = rows.temp ;
            mandar.value = rows.relacao ;
        });
    });
    inputSHOW(true);
}

function deletar(){
    
    var id = document.getElementById('field-id').value;
    
    db.transaction(function(tx) {
        tx.executeSql("DELETE FROM TableAmor WHERE id=?", [id]);
    });
    
    mostrar();
    limpaCampo();
    inputSHOW(false);
}