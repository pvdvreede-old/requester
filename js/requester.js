var reqmod = angular.module('requester', ['history.service']);
reqmod.config(function($routeProvider) {
  $routeProvider.
    when('/request/:requestId', { controller: RequestCtrl, templateUrl: 'request.html' }).
    otherwise({redirectTo: '/request/new'});
});

var MainCtrl = function($scope, $routeParams, HisStorage) {
  HisStorage.load();
  $scope.history = HisStorage.items;

  $scope.clearHistory = function() {
    HisStorage.clear();
    $scope.history = HisStorage.items;
  };
};

var RequestCtrl = function($scope, $location, $routeParams, HisStorage) {
  // set defaults
  $scope.method = 'GET';
  $scope.headers = [
    { key: 'Accept', value: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' },
  ];

  $scope.addHeader = function() {
    $scope.headers.push({ key: 't', value: '' });
  };

  $scope.removeHeader = function(header) {
    for(i in $scope.headers) {
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

  HisStorage.get($routeParams.requestId, function(current_request) {
    if (current_request) {
      $scope.headers = current_request.headers;
      $scope.url = current_request.url;
      $scope.method = current_request.method;
      $scope.requestbody = current_request.body;
      $scope.responsebody = current_request.responsebody;
      $scope.responseheaders = current_request.responseheaders;
    }
  });

  $scope.sendRequest = function() {   
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
	if (xhr.readyState == 4) {
          var responsebody = xhr.responseText;
          var responseheaders = xhr.getAllResponseHeaders().split("\n");

          HisStorage.save({
            time: new Date().toString(),
            url: $scope.url,
            method: $scope.method,
            headers: $scope.headers,
            body: $scope.requestbody,
            responseheaders: responseheaders,
            responsebody: responsebody
          }, function(request) {
            $scope.$apply(function() {
              $scope.history = HisStorage.items;
	      $scope.responseheaders = responseheaders;
              $scope.responsebody = responsebody;
            });
          });
        }
    };
    xhr.open($scope.method, $scope.url);
    xhr.send();      
  };

};
