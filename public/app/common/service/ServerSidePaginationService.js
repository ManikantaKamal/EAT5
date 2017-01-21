'use strict';
reachApp.factory('ServerSidePaginationService', ['$http', '$q', 'DTOptionsBuilder', 'DTColumnDefBuilder','$rootScope', function ($http, $q, DTOptionsBuilder, DTColumnDefBuilder,$rootScope) {
    var paginationServiceParams = { 
        ssp_pages: [],
        paging: {
            ssp_info: {
                totalItems: 0,
                totalPages: 1,
                currentPage: 1,
                page: 1,
                limit: 5,
                from: 0,
                where_condition: "",
                skippedcount:0,
                currentUrl:"",
                httpMethod:'POST'
            }
        },
        tableParams: {
            dtOptions: [],
            dtColumnDefs: []
        }
    };


    return {
        initializeTable: function (dtOptions, dtcolumndefs) { 
            
                paginationServiceParams.tableParams.dtOptions = DTOptionsBuilder.newOptions()
         .withOption('bDestroy', true).withBootstrap().withDisplayLength(paginationServiceParams.paging.ssp_info.limit).withDOM('<"H"<>r>t<>').withBootstrapOptions({
             TableTools: {
                 classes: {
                     container: 'btn-group',
                     buttons: {
                         normal: 'btn btn-danger'
                     }
                 }
             }
         });
          
            
            var sortableColumns = [];
            var columnNos = angular.element(angular.element('#' + dtOptions.TableName)[0]).find('thead').find('tr').children().length;
            for (var i = 0; i < columnNos; i++) {
                if (dtcolumndefs.length > 0) {
                    if (dtcolumndefs.indexOf(i) == -1) {
                        sortableColumns.push(DTColumnDefBuilder.newColumnDef(i).notSortable());
                    }
                }
                else {
                    sortableColumns.push(DTColumnDefBuilder.newColumnDef(i).notSortable());
                }
            }
            paginationServiceParams.tableParams.dtColumnDefs = sortableColumns;

        },
        attachServerSidePagination: function (params) { 
            this.clear();
            paginationServiceParams.paging.ssp_info.httpMethod= params.httpMethod==undefined? paginationServiceParams.paging.ssp_info.httpMethod:params.httpMethod;
            
            
            
            if(params.data ==undefined){ 
            var request= {};
            paginationServiceParams.paging.ssp_info.where_condition = JSON.stringify({'request':request});
            }
            else
            paginationServiceParams.paging.ssp_info.where_condition = params.data;
            
            this.navigate(1, params.Url,params.paginationServiceParams);
        },
        navigate: function (pageNumber, serversideUrl,params) { 
            var dfd = $q.defer();

            if (pageNumber > paginationServiceParams.paging.ssp_info.totalPages) {
                return dfd.reject({ error: "page number out of range" });
            }

            if (paginationServiceParams.ssp_pages[pageNumber]) {
                paginationServiceParams.paging.ssp_info.currentPage = pageNumber;
                dfd.resolve();
            } else {
                return this.load(pageNumber, serversideUrl,params);
            }

            return dfd.promise;
        },
        load: function (pageNumber, serversideUrl,params) { 
        	paginationServiceParams.paging.ssp_info.skippedcount=(pageNumber-1)*paginationServiceParams.paging.ssp_info.limit;
        	serversideUrl=serversideUrl.indexOf('?')>0 ? serversideUrl+'&':serversideUrl+'?';
            var deferred = $q.defer(); //promise
            $http({
            	method:  paginationServiceParams.paging.ssp_info.httpMethod,
                url: serversideUrl + 'limit=' + paginationServiceParams.paging.ssp_info.limit + '&skip=' + paginationServiceParams.paging.ssp_info.skippedcount,
                data: paginationServiceParams.paging.ssp_info.where_condition,
                headers: {'contentType': 'application/json'}
               // + '&Where=' + paginationServiceParams.paging.ssp_info.where_condition
            }).
                success(function (data, status, headers, config) {
                    deferred.resolve(data);
                    
                }).
                error(function (data, status, headers, config) {
                    deferred.reject(status);
                });

            return deferred.promise.then(
                        function (result) { 
                            var newPage = { 
                                number: paginationServiceParams.paging.ssp_info.limit,
                                result: []
                            };
	                            if(result.ViewModel !=undefined && result.ViewModel!=null)
	                            	{
			                            params.totalItems=result.ViewModel;
			                            params.totalPages=Math.ceil(params.totalItems / paginationServiceParams.paging.ssp_info.limit );
	                            	}
                            
                            if(result.ViewModels!=null){
                            result.ViewModels.forEach(function (data) {
                                newPage.result.push(data);
                            });}
                            paginationServiceParams.ssp_pages[pageNumber] = newPage;
                            paginationServiceParams.paging.ssp_info.currentPage = pageNumber;
                            paginationServiceParams.paging.ssp_info.totalPages = params.totalPages;
                            paginationServiceParams.paging.ssp_info.totalItems = params.totalItems;
                            $rootScope.$emit('pagination_Result',paginationServiceParams.paging.ssp_info);
                            return result.$promise;
                        }, function (result) {
                            return $q.reject(result);
                        });
        },
                 clear: function () {
                        
            paginationServiceParams.ssp_pages.length = 0;
            paginationServiceParams.paging.ssp_info.totalItems = 0;
            paginationServiceParams.paging.ssp_info.currentPage = 0;
            paginationServiceParams.paging.ssp_info.totalPages = 1;
        },
        paginationServiceParams: function () { return paginationServiceParams; },
        initialize: function () {
            paginationServiceParams.paging.ssp_info.currentPage = 1;
        }
    }
} ]);


