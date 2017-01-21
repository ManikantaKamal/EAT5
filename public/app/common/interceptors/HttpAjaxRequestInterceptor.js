/***
Http Request Interceptor to perform action during http request and http response.
The actions that are included are as below,
i) Introduce page level progress bar with the number requests that are processed in a page
ii) Handle JWT token authorization for each http request
--Add the interceptor in aap.config
*/
reachApp.factory( 'httpAjaxRequestInterceptor', function ( $rootScope, $q, $window, $location, store )
{ 
    var numRequests = 0;
    //var ajaxSpinner = $( "#spinnerModal" );
    var hideSpinner = function ( r )
    {
        if ( ! --numRequests )
        {
            $rootScope.httpRequestloading = false;
            //ajaxSpinner.hide();
        }
        return r;
    };
    return {
        'request': function ( config )
        { 
            numRequests++;
            $rootScope.httpRequestloading = true;
            //ajaxSpinner.show();
            config.headers = config.headers || {};
            var authTokenFromLocalStorage = store.get( 'authToken' );
            if ( authTokenFromLocalStorage != null )
            {
                config.headers["x-access-token"] = authTokenFromLocalStorage;
            }
            return config;
        },
        'response': function ( response )
        {
        	if(response.data!=undefined && response.data.ViewModel!=undefined && response.data.ViewModel=='Unauthorized')
        	{
        		 $location.path( '/' );
        	}
            return hideSpinner( response );
        },
        'responseError': function ( response )
        {
            if ( response.status === 401 || response.status === 403 )
            {
                $location.path( '/' );
            }
            return $q.reject( hideSpinner( response ) );
        }
    };
} );