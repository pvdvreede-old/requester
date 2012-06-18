var historymod = angular.module('history.service', []);
historymod.factory('HisStorage', function() {
  var HisStorage = {};
  HisStorage.items = [];
  HisStorage.save = function(request, cb) {
    request.id = guid();
    if (!HisStorage.items) HisStorage.items = [];
    HisStorage.items.unshift(request);
    localStorage.setItem('req-history', JSON.stringify(HisStorage.items));
    cb(request);
  };
  HisStorage.load = function() {
    var history = localStorage.getItem('req-history');
    HisStorage.items = JSON.parse(history);
    return HisStorage.items;
  };

  HisStorage.get = function(id, cb) {
    for (var i in HisStorage.items) {
      if (HisStorage.items[i].id == id) {
        cb(HisStorage.items[i]);
        return;
      }
    }
    cb(null);
  };

  HisStorage.clear = function() {
    HisStorage.items = [];
    localStorage.setItem('req-history', JSON.stringify(HisStorage.items));
  };

  var S4 = function() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };

  var guid = function() {
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  };

  return HisStorage;
});

