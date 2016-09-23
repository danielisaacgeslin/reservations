describe('filter: time', function(){

  beforeEach(module('app'));

  it('should return Morning', inject(function($filter){
    expect($filter('time')(1)).toBe('Morning');
  }));

});
