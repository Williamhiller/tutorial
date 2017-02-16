/**
 * Created by Williamhiler on 2016/11/4.
 */
angular.module('user.service',[])

    // session
    .factory('Cookie',['$cookieStore',function ($cookieStore)  {
        this.create = function (sessionId, userId, userRole) {
            $cookieStore.put('sessionId',sessionId);
            $cookieStore.put('userId',userId);
            $cookieStore.put('userRole',userRole);
        };
        this.destroy = function () {
            $cookieStore.remove('sessionId');
            $cookieStore.remove('userId');
            $cookieStore.remove('userRole');
        };
        return this;
    }]);
