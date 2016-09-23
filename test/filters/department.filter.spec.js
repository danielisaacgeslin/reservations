describe('filter: department', function(){

  beforeEach(module('app'));

  it('should return A', inject(function($filter){
    expect($filter('department')(1)).toBe('A');
  }));

});
