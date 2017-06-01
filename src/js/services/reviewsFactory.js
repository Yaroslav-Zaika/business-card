angular.module('app')
  .factory('reviewsFactory', function ($rootScope) {
  
    var obj = {};
    var reviews = [
      {
        id: 1,
        name: 'Самуил',
        date: '13 октября 2011',
        text: 'Привет, Верунь! ниче себе ты крутая. фотка класс!!!!'
      },
      {
        id: 2,
        name: 'Лилия Семёновна',
        date: '14 октября 2011',
        text: 'Вероника, здравствуйте! Есть такой вопрос: Особый вид куниц жизненно стабилизирует кинетический момент, это и есть всемирно известный центр огранки алмазов и торговли бриллиантами?'
      },
      {
        id: 3,
        name: 'Лилия Семёновна',
        date: '14 октября 2011',
        text: 'Вероника, здравствуйте! Есть такой вопрос: Особый вид куниц жизненно стабилизирует кинетический момент?'
      }
    ];
    
    obj.set = function (text) {
      if (text) {
        var date = new Date();
        var months = 'января,февраля,марта,апреля,мая,июня,июля,августа,сентября,октября,декабря'.split(',');
        
        var review = {
          id: reviews.length + 1,
          name: 'Гость',
          date: date.getDate() +' '+ months[date.getMonth()] +' '+ date.getFullYear(),
          text: text
        };
        
        reviews.push(review);
        $rootScope.$broadcast('reviews_update');
      }
    };
    
    obj.get = function () {
      return reviews;
    };
    
    return {
      set: obj.set,
      get: obj.get
    }
  });