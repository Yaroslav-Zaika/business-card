angular.module('app')
  .controller('reviewsController', function ($rootScope, $filter, reviewsFactory) {
    var self = this;
    var flag;
  
    self.getReviews = function (value) {
      flag = value;
      var reviews = reviewsFactory.get();
      linkActive(flag);
      
      if (flag) {
        return self.reviews = $filter('limitTo')(reviews, 3, -3);
      } else {
        return self.reviews = reviews;
      }
    };
  
    self.addReview = function addReview (text) {
      reviewsFactory.set(text);
      self.text = '';
    };
  
    $rootScope.$on('reviews_update', function () {
      self.getReviews(flag);
    });
  
    function linkActive (flag) {
      var link;
      if (flag) {
        link =  angular.element(document.querySelector('.reviews__nav')).children()[0];
        angular.element(angular.element(document.querySelector('.reviews__nav')).children()[1])
          .removeClass('reviews__nav_link-active');
      } else {
        link =  angular.element(document.querySelector('.reviews__nav')).children()[1];
        angular.element(angular.element(document.querySelector('.reviews__nav')).children()[0])
          .removeClass('reviews__nav_link-active');
      }
      
      angular.element(link).addClass('reviews__nav_link-active');
    }
  });