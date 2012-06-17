var reqmod = angular.module('requester', ['history.service']);
reqmod.config(function($routeProvider) {
  $routeProvider.
    when('/', {controller: MainCtrl}).
    when('/request/:requestId', { controller: RequestCtrl, templateUrl: 'request.html' }).
    otherwise({redirectTo: '/'});
});

var MainCtrl = function($scope, $routeParams, HisStorage) {
  $scope.status = $routeParams.requestId;
  $scope.headers = [{ key: 'test', value: ''}];
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

  HisStorage.load();
  $scope.history = HisStorage.items;

  $scope.clearHistory = function() {
    HisStorage.clear();
    $scope.history = HisStorage.items;
  };
};

var RequestCtrl = function($scope, $routeParams, HisStorage) {
  HisStorage.get($routeParams.requestId, function(current_request) {
    if (current_request) {
      $scope.headers = current_request.headers;
      $scope.url = current_request.url;
      $scope.method = current_request.method;
      $scope.requestbody = current_request.body;
    }
  });

  $scope.sendRequest = function() {
    HisStorage.save({
      url: $scope.url,
      method: $scope.method,
      headers: $scope.headers,
      body: $scope.requestbody
    });
  };

};
