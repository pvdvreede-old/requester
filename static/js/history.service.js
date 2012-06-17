var historymod = angular.module('history.service', []);
historymod.factory('HisStorage', function() {
  var HisStorage = {};
  HisStorage.items = [];
  HisStorage.save = function(request) {
    request.id = Math.random().toString();
    if (!HisStorage.items)
      HisStorage.items = [];
    HisStorage.items.unshift(request);
    localStorage.setItem('req-history', JSON.stringify(HisStorage.items));
  };
  HisStorage.load = function() {
    var history = localStorage.getItem('req-history');
    HisStorage.items = JSON.parse(history);
    return HisStorage.items;
  };

  return HisStorage;
});
