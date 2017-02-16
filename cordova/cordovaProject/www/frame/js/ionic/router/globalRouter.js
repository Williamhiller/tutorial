/**
 * Created by Williamhiler on 2016/11/7.
 */
angular.module("global.router",["ionic","home.router","credit.router","me.router","user.router","message.router"])
    .config(function ($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('tab', {
                url: '',
                abstract: true,
                templateUrl: 'html/tabs.html'
            })

        $urlRouterProvider.otherwise('/home');
    });
