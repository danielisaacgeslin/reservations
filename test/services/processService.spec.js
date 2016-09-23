describe('service: processService', function(){

  beforeEach(module('app'));

  it('should add zeros', inject(function(processService){
    expect(processService.addZeros(1)).toBe('01');
  }));

  it('should adapt DB arrays', inject(function(processService){
    var before = [{ID:1, TEXT: 'test'}];
    var after = {1: {id:1, text: 'test'}}
    expect(processService.dbArrayAdapter(before)).toEqual(after);
  }));
});
