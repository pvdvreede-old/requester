var reqmod = angular.module('requester', ['history.service']);
reqmod.config(function($routeProvider) {
  $routeProvider.
  when('/request/:requestId', {
    controller: RequestCtrl,
    templateUrl: 'request.html'
  }).
  otherwise({
    redirectTo: '/request/new'
  });
});

var MainCtrl = function($scope, $routeParams, HisStorage) {
  HisStorage.load();
  $scope.history = HisStorage.items;

  $scope.clearHistory = function() {
    HisStorage.clear();
    $scope.history = HisStorage.items;
  };

  $('#historytab a').click(function(e) {
    e.preventDefault();
    $(this).tab('show');
  });
};

var RequestCtrl = function($scope, $location, $routeParams, HisStorage) {
  // set defaults
  $scope.method = 'GET';
  $scope.headers = [{
    key: 'Accept',
    value: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
  },
  ];

  $scope.addHeader = function() {
    $scope.headers.push({
      key: '',
      value: ''
    });
  };

  $scope.removeHeader = function(header) {
    for (var i in $scope.headers) {
      if ($scope.headers[i].key == header.key) {
        $scope.headers.splice(i, 1)
        break;
      }
    }
  };

  $scope.showBody = function() {
    $('#request-body').show();
  };

  $scope.hideBody = function() {
    $('#request-body').hide();
  };

  $scope.checkBody = function() {
    if ($scope.method == 'GET') {
      $scope.hideBody();
    } else {
      $scope.showBody();
    }
  };

  HisStorage.get($routeParams.requestId, function(current_request) {
    if (current_request) {
      $scope.headers = current_request.headers;
      $scope.url = current_request.url;
      $scope.method = current_request.method;
      $scope.requestbody = current_request.body;
      $scope.responsebody = current_request.responsebody;
      $scope.responseheaders = current_request.responseheaders;
      $scope.responsestatus = current_request.responsestatus;
    }

    $scope.checkBody();
  });

  $scope.sendRequest = function() {
    var xhr = new XMLHttpRequest();

    // remove old response if there was one
    $scope.responsestatus = '';
    $scope.responseheaders = [];
    $scope.responsebody = '';

    xhr.onerror = function(e) {
      $scope.$apply(function() {
        $scope.responsestatus = "An error has occured.";
        $('#loading').hide();
      });
    };

    xhr.onload = function() {
      if (xhr.readyState == 4) {
        var responsebody = xhr.responseText;
        var responseheaders = xhr.getAllResponseHeaders().split("\r\n");
        // remove last header string in array as it is blank
        responseheaders.pop();
        var responsestatus = xhr.status + " - " + xhr.statusText;

        HisStorage.save({
          time: new Date().toString(),
          url: $scope.url,
          method: $scope.method,
          headers: $scope.headers,
          body: $scope.requestbody,
          responseheaders: responseheaders,
          responsebody: responsebody,
          responsestatus: responsestatus
        },
        function(request) {
          // Kick angular to update the screen after the request has come back
          $scope.$apply(function() {
            $scope.history = HisStorage.items;
            $scope.responseheaders = responseheaders;
            $scope.responsebody = responsebody;
            $scope.responsestatus = responsestatus;
            $('#loading').hide();
          });
        });
      }
    };

    xhr.open($scope.method, $scope.url);

    // set the headers
    $scope.headers.forEach(function(h, i) {
      xhr.setRequestHeader(h.key, h.value);
    });

    if ($scope.method == 'GET') {
      xhr.send();
    } else {
      xhr.send($scope.requestbody);
    }
    $('#loading').show();
  };

  // hide loading icon until its needed
  $('#loading').hide();
};

