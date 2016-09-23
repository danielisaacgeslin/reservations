describe('filter: month', function(){

  beforeEach(module('app'));

  it('should filter an object of objects by month by the date key', inject(function($filter){
    var before = {'a': {date: new Date('2/12/2016')}, 'b':{date: new Date('3/25/2016')}};
    var after = {'a':{date: new Date('2/12/2016')}};
    var date = new Date('2/1/2016');
    expect($filter('monthFilter')(before, date)).toEqual(after);
  }));

});
