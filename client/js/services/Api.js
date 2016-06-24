app.factory('Api', function($resource){
	return {
		Produtos: $resource('/api/produtos/:id', {id: '@id'})
	};
});