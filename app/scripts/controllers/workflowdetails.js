'use strict';

/**
 * @ngdoc function
 * @name dockstore.ui.controller:WorkflowDetailsCtrl
 * @description
 * # WorkflowDetailsCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('WorkflowDetailsCtrl', [
    '$scope',
    '$q',
    'WorkflowService',
    'FormattingService',
    'NotificationService',
    function ($scope, $q, WorkflowService, FrmttSrvc, NtfnService) {

      $scope.labelsEditMode = false;
      $scope.descriptorEnabled = false;
      $scope.validContent = true;
      $scope.missingContent = [];
      $scope.missingWarning = false;
      if (!$scope.activeTabs) {
        $scope.activeTabs = [true];
        for (var i = 0; i < 3; i++) $scope.activeTabs.push(false);
      }

      $scope.checkPage = function(){
        $scope.$broadcast('checkDescPageType');
      }

      $scope.loadWorkflowDetails = function(workflowPath) {
        $scope.setWorkflowDetailsError(null);
        return WorkflowService.getPublishedWorkflowByPath(workflowPath)
          .then(
            function(workflowObj) {
              $scope.workflowObj = workflowObj;
            },
            function(response) {
              $scope.setWorkflowDetailsError(
                'The webservice encountered an error trying to retrieve this ' +
                'workflow, please ensure that the workflow exists and is ' +
                'published for public access.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          );
      };

      $scope.setWorkflowRegistration = function(workflowId, isPublished) {
        $scope.setWorkflowDetailsError(null);
        return WorkflowService.setWorkflowRegistration(workflowId, isPublished)
          .then(
            function(workflowObj) {
              $scope.workflowObj.is_published = workflowObj.is_published;
              $scope.updateWorkflowObj();
              return workflowObj;
            },
            function(response) {
              $scope.setWorkflowDetailsError(
                'The webservice encountered an error trying to register this ' +
                'workflow, please ensure that the associated ' +
                'descriptor is valid and accessible.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          ).finally(function(response) {
            $scope.workflowEditData.isPublished = $scope.workflowObj.is_published;
          });
      };

      // $scope.resetDocument = function(){
      //   $scope.$broadcast('refreshFiles');
      // };

      $scope.refreshWorkflow = function(workflowId, activeTabIndex) {
        $scope.setWorkflowDetailsError(null);
        if ($scope.refreshingWorkflow) return;
        $scope.refreshingWorkflow = true;
        return WorkflowService.refreshWorkflow(workflowId)
          .then(
            function(workflowObj) {
              $scope.updateWorkflowObj({
                workflowObj: workflowObj,
                activeTabIndex: activeTabIndex ? activeTabIndex : null
              });
              $scope.updateInfoURLs();
              $scope.$broadcast('refreshFiles');
              return workflowObj;
            },
            function(response) {
              $scope.setWorkflowDetailsError(
                'The webservice encountered an error trying to refresh this ' +
                'workflow, please ensure that the associated ' +
                'descriptor is valid and accessible.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          ).finally(function(response) {
            $scope.refreshingWorkflow = false;
          });
      };

      $scope.checkValidation = function(){
        //this function is just a bridge to call the function on 'workflowfileviewer.js' to check content of file
        console.log($scope.workflowObj);
        $scope.missingContent = [];
        $scope.$broadcast('getFile');
      };

      $scope.checkContentValid = function(){
        //will print this when the 'Publish' button is clicked
        var message = 'The file is missing some required fields. Please make sure the file has all the required fields. ';
        var missingMessage = 'The missing field(s):'
        if($scope.validContent){
          if($scope.missingContent.length !== 0 && $scope.workflowObj.is_published){
            $scope.missingWarning = true;
          }
          return true;

        } else{
            if($scope.missingContent.length !== 0 && $scope.workflowObj.is_published){
              $scope.missingWarning = false;
              for(var i=0;i<$scope.missingContent.length;i++){
                missingMessage += ' \''+$scope.missingContent[i]+'\'';
                if(i!=$scope.missingContent.length -1){
                  missingMessage+=',';
                }
              }
              if(!$scope.refreshingWorkflow){
                if($scope.workflowObj.descriptorType === 'wdl'){
                  $scope.setWorkflowDetailsError(
                    message+missingMessage +
                    '. Required fields in WDL file: \'task\', \'workflow\', \'call\', \'command\', and \'output\'',''
                  );
                }else{
                  $scope.setWorkflowDetailsError(
                    message+missingMessage +
                    '. Required fields in CWL file: \'inputs\', \'outputs\', \'class\', and \'steps\'',''
                  );
                }
              }
            }

          return false;
        }
      };

      $scope.setWorkflowLabels = function(workflowId, labels) {
        $scope.setWorkflowDetailsError(null);
        return WorkflowService.setWorkflowLabels(workflowId, labels)
          .then(
            function(workflowObj) {
              $scope.workflowObj.labels = workflowObj.labels;
              $scope.updateWorkflowObj();
              return workflowObj;
            },
            function(response) {
              $scope.setWorkflowDetailsError(
                'The webservice encountered an error trying to modify labels ' +
                'for this workflow, please ensure that the label list is ' +
                'properly-formatted and does not contain prohibited ' +
                'characters of words.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          );
      };

      $scope.resetWorkflowEditData = function(workflowObj) {
        var labels = (function(labelObjArray) {
          var labelArray = $scope.getWorkflowLabelStrings(labelObjArray);
          var labels = '';
          for (var i = 0; i < labelArray.length; i++) {
            labels += labelArray[i] + ((i !== labelArray.length - 1) ? ', ' : '');
          }
          return labels;
        })(workflowObj.labels);

        $scope.workflowEditData = {
          labels: labels,
          is_published: workflowObj.is_published
        };
      };

      $scope.setWorkflowDetailsError = function(message, errorDetails) {
        if (message) {
          $scope.workflowDetailsError = {
            message: message,
            errorDetails: errorDetails
          };
        } else {
          $scope.workflowDetailsError = null;
        }
      };

      $scope.getDaysAgo = function(timestamp) {
        var timeDiff = (new Date()).getTime() - timestamp;
        return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      };

      $scope.getDaysAgoString = function(timestamp) {
        var daysAgo = $scope.getDaysAgo(timestamp);
        if(daysAgo < 0){
          daysAgo = 0;
        }
        return daysAgo.toString() +
                ((daysAgo === 1) ? ' day ago' : ' days ago');
      };

      $scope.getGitReposProvider = FrmttSrvc.getGitReposProvider;
      $scope.getGitReposProviderName = FrmttSrvc.getGitReposProviderName;
      $scope.getGitReposWebUrlFromPath = FrmttSrvc.getGitReposWebUrlFromPath;

      $scope.updateInfoURLs = function() {
        /* Git Repository */
        $scope.gitReposProvider = $scope.getGitReposProvider(
            $scope.workflowObj.gitUrl);
        $scope.gitReposProviderName = $scope.getGitReposProviderName(
            $scope.gitReposProvider);
        $scope.gitReposWebUrlFromPath = $scope.getGitReposWebUrlFromPath(
            $scope.workflowObj.organization,
            $scope.workflowObj.repository,
            $scope.gitReposProvider);
      };

      $scope.getDateTimeString = FrmttSrvc.getDateTimeString;

      $scope.getWorkflowLabelStrings = function(labels) {
        var sortedLabels = labels.sort(function(a, b) {
          if (a.value < b.value) return -1;
          if (a.value > b.value) return 1;
          return 0;
        });
        var labelStrings = [];
        for (var i = 0; i < sortedLabels.length; i++) {
            labelStrings.push(sortedLabels[i].value);
        }
        return labelStrings;
      };

      $scope.checkOverflow = function() {

        if ($('#label-values')[0].scrollHeight > $('#label-holder').height()) {
           return true;
        } else {
          return false;
        }
      };

       $scope.moveToStart = function(element) {
         $('#label-button-holder').insertBefore($('#' + element));

       };

      $scope.selectLabelTab = function() {
       for (var i = 0; i < 4; i++) $scope.activeTabs[i] = false;
       $scope.activeTabs[1] = true;
      };

      $scope.toggleLabelsEditMode = function() {
        $scope.labelsEditMode = !$scope.labelsEditMode;
      };

      $scope.submitWorkflowEdits = function() {
        if (!$scope.labelsEditMode) {
          $scope.labelsEditMode = true;
          return;
        }
        // the edit object should be recreated

        if ($scope.workflowEditData.labels !== 'undefined') {
          $scope.setWorkflowLabels($scope.workflowObj.id,
              $scope.workflowEditData.labels)
            .then(function(workflowObj) {
              $scope.labelsEditMode = false;
            });
        }
      };

      $scope.isWorkflowValid = function() {
        if ($scope.workflowObj.is_published) {
          return true;
        }

        var versionTags = $scope.workflowObj.workflowVersions;

        if (versionTags === null) {
          return false;
        }

        for (var i = 0; i < versionTags.length; i++) {
          if (versionTags[i].valid) {
            return true;
          }
        }
        return false;
      };

      $scope.isWorkflowFull = function() {
        if ($scope.workflowObj.mode === 'FULL') {
          return true;
        }
        return false;
      };

      $scope.$watch('workflowPath', function(newValue, oldValue) {
        if (newValue) {
          $scope.setWorkflowDetailsError(null);
          if (!$scope.editMode) {
            $scope.loadWorkflowDetails($scope.workflowPath)
              .then(function(workflowObj) {
                $scope.updateInfoURLs();
              });
          } else {
            $scope.labelsEditMode = false;
            $scope.resetWorkflowEditData($scope.workflowObj);
            $scope.updateInfoURLs();
          }
        }
      });

      $scope.getRegistry = function(gitUrl) {
      if (gitUrl.indexOf('github.com') !== -1) {
          return 'GitHub';
        } else if (gitUrl.indexOf('bitbucket.org') !== -1) {
          return 'Bitbucket';
        } else {
          return null;
        }
      };

     $scope.getRepoUrl = function(organization, repository, registry) {
      if (registry.toLowerCase() === "github") {
          return 'https://github.com/' + organization + '/' + repository;
        } else if (registry.toLowerCase() === "bitbucket") {
          return 'https://bitbucket.org/' + organization + '/' + repository;
        } else {
          return null;
        }
      };

  }]);
