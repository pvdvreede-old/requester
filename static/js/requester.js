var reqmod = angular.module('requester', ['history.service']);

var MainCtrl = function($scope, HisStorage) {
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

  $scope.sendRequest = function() {
    HisStorage.save({
      url: $scope.url,
      method: $scope.method,
      headers: $scope.headers,
      body: $scope.requestbody
    });

    $scope.history = HisStorage.load();
  };

  $scope.history = HisStorage.load();

};
