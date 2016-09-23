describe('filter: dateToNumber', function(){

  beforeEach(module('app'));

  it('should convert a date to a number', inject(function($filter){
    var now = Date.now();
    var date = new Date(now);
    expect($filter('dateToNumber')(date)).toBe(now);
  }));
});
