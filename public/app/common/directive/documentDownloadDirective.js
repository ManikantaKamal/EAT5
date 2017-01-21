'use strict';
//http://plnkr.co/edit/octwC4BCuXLmRhHgLD8T?p=preview
reachApp.directive('documentDownload', function() {
    return {
        restrict: 'E',
        templateUrl: 'app/common/view/directiveTemplates/documentdownload/documentdownload.html',
        scope: true,
        link: function(scope, element, attr) {
            var anchor = element.children()[0];
 
            // When the download starts, disable the link
            scope.$on('download-start', function() {
                $(anchor).attr('disabled', 'disabled');
            });
 
            // When the download finishes, attach the data to the link. Enable the link and change its appearance.
            scope.$on('downloaded', function(event, responseObj) {
                scope.DocumentDownloadedCallback(responseObj.data,responseObj.status,responseObj.headers);
            });

            scope.DocumentDownloadedCallback=function(data, status, headers){
                var octetStreamMime = 'application/octet-stream';
                var success = false;

                // Get the headers
                headers = headers();

                // Get the filename from the x-filename header or default to "download.bin"
                var filename = headers['x-file-name'] || 'download.jpg';

                // Determine the content type from the header or default to "application/octet-stream"
                var contentType = headers['content-type'] || octetStreamMime;

                try {

                    console.log(filename);
                    // Try using msSaveBlob if supported
                    console.log("Trying saveBlob method ...");
                    var blob = new Blob([data], { type: contentType });
                    if (navigator.msSaveBlob)
                        navigator.msSaveBlob(blob, filename);
                    else {
                        // Try using other saveBlob implementations, if available
                        var saveBlob = navigator.webkitSaveBlob || navigator.mozSaveBlob || navigator.saveBlob;
                        if (saveBlob === undefined) throw "Not supported";
                        saveBlob(blob, filename);
                    }
                    console.log("saveBlob succeeded");
                    success = true;
                } catch (ex) {
                    console.log("saveBlob method failed with the following exception:");
                    console.log(ex);
                }
                    if (!success) {
                    // Get the blob url creator
                    var urlCreator = window.URL || window.webkitURL || window.mozURL || window.msURL;
                    if (urlCreator) {
                        // Try to use a download link
                        var link = document.createElement('a');
                        if ('download' in link) {
                            // Try to simulate a click
                            try {
                                // Prepare a blob URL
                                console.log("Trying download link method with simulated click ...");
                                var blob = new Blob([data], { type: contentType });
                                var url = urlCreator.createObjectURL(blob);
                                link.setAttribute('href', url);

                                // Set the download attribute (Supported in Chrome 14+ / Firefox 20+)
                                link.setAttribute("download", filename);

                                // Simulate clicking the download link
                                var event = document.createEvent('MouseEvents');
                                event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
                                link.dispatchEvent(event);
                                console.log("Download link method with simulated click succeeded");
                                success = true;

                            } catch (ex) {
                                console.log("Download link method with simulated click failed with the following exception:");
                                console.log(ex);
                            }
                        }

                        if (!success) {
                            // Fallback to window.location method
                            try {
                                // Prepare a blob URL
                                // Use application/octet-stream when using window.location to force download
                                console.log("Trying download link method with window.location ...");
                                var blob = new Blob([data], { type: contentType });
                                var url = urlCreator.createObjectURL(blob);
                                window.location = url;
                                console.log("Download link method with window.location succeeded");
                                success = true;
                            } catch (ex) {
                                console.log("Download link method with window.location failed with the following exception:");
                                console.log(ex);
                            }
                        }

                    }
                }

                if (!success) {
                    // Fallback to window.open method
                    console.log("No methods worked for saving the arraybuffer, using last resort window.open");
                    window.open(httpPath, '_blank', '');
                }
            }
        },
        controller: ['$scope', '$attrs', '$http', function($scope, $attrs, $http) {
            $scope.downloadDocument = function() {
                $scope.$emit('download-start');
                $http({
                    method: 'GET',
                    cache: false,
                    responseType:'arraybuffer', //Required to resolve the issue "file appears to be damaged or corrupted"
                    url: $attrs.url
                }).then(function(data) {
                    $scope.$emit('downloaded', data);
                });
            };
        }] 
    }
});