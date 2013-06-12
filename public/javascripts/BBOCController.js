function BBOCController($scope, $http, $timeout) {
  $scope.data = {};
  var query = function() {
    $http.get('/bbo.json').success(function(data) {
      $scope.data = data;
    });
    $timeout(query, 250);
  };
  $timeout(query, 250);
}