    var getJSON =  function (brApiSite){
        return new Promise(function(resolve, reject) {
          var request = new XMLHttpRequest();
          request.open('GET', brApiSite + '/brapi/v1/maps/', true);
   
          request.onreadystatechange = function() {
            if (this.readyState === 4 && this.status == 200) {
              var status = this.status;
              var myArr = JSON.parse(this.responseText);           
              resolve(myArr); 
            } 
        }
        request.send();
        }); 
    }

    var getMapPositionJSON =  function (brApiSite,mapSId){
        return new Promise(function(resolve, reject) {
          var request = new XMLHttpRequest();
          request.open('GET', brApiSite + '/brapi/v1/maps/'+ mapSId +'/positions?pageSize=100000000', true);
     
          request.onreadystatechange = function() {
            if (this.readyState === 4 && this.status == 200) {
              var status = this.status;
              var myArr = JSON.parse(this.responseText);           
              resolve(myArr); 
            } 
        }
        request.send();
        });
    }

    var getMapJSON =  function (brApiSite,mapSId){
        return new Promise(function(resolve, reject) {
          var request = new XMLHttpRequest();
          request.open('GET', brApiSite + '/brapi/v1/maps/'+ mapSId, true);
     
          request.onreadystatechange = function() {
            if (this.readyState === 4 && this.status == 200) {
              var status = this.status;
              var myArr = JSON.parse(this.responseText);           
              resolve(myArr); 
            } 
        }
        request.send();
        });
    }

  var getMapChrJSON =  function (brApiSite,mapSId,nChr1,tittle){
        return new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('GET', brApiSite + '/brapi/v1/maps/'+ mapSId +'/positions?linkageGroupId='+ nChr1 +'&pageSize=100000000', true);
   
        request.onreadystatechange = function() {
          if (this.readyState === 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);           
            resolve(myArr); 
            }
        }
        request.send();
        });
  }

  var authRequest = function (brApiSite){
      
      var request = new XMLHttpRequest();
      request.open('POST', brApiSite + '/brapi/v1/login');
      request.setRequestHeader('Content-Type', 'application/json');

      request.onreadystatechange = function () {
          if (this.readyState === 4) {
              console.log('Status:', this.status);
              console.log('Headers:', this.getAllResponseHeaders());
              console.log('Body:', this.responseText);
          }
      };

      var body = {
        'client_id': '',
        'grant_type': 'authorization_code',
        'password': 'password0',
        'username': 'username0'
      };

      request.send(JSON.stringify(body));
  }

  function listMapsDropDown(dataSource,mapId){

      var brApiSite = document.getElementById(dataSource).value;

      var result = getJSON(brApiSite).then(function(d) { return d;
          }, function(status) {
          alert('Something went wrong');
      });

      Promise.all([ result ])
          .then((values) => { 
              const data = values[0].result.data; 
              for (var  i = 0; i<data.length; i++){
                  var select = document.getElementById(mapId);
                  select.options[select.options.length] = new Option(data[i].mapName, data[i].mapDbId);
              }
      });
  }
