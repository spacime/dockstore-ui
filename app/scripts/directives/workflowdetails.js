'use strict';

/**
 * @ngdoc directive
 * @name dockstore.ui.directive:workflowDetails
 * @description
 * # workflowDetails
 */
angular.module('dockstore.ui')
  .directive('workflowDetails', function () {
    return {
      restrict: 'AE',
      controller: 'WorkflowDetailsCtrl',
      scope: {
        workflowPath: '=',
        workflowWorkflowname: '=',
        workflowObj: '=',
        editMode: '=',
        activeTabs: '=',
        updateWorkflowObj: '&'
      },
      templateUrl: 'templates/workflowdetails.html',
      link: function postLink(scope, element, attrs) {
        scope.$on('versionTagEditorRefreshWorkflow', function(event, workflowId) {
          scope.refreshWorkflow(workflowId, 2);
        });
        scope.$on('refreshWorkflows', function(event) {
          console.log("refreshWorkflows function");
          console.log(scope.activeTabs.indexOf(true));
          console.log(scope.workflowObj.id);
          scope.refreshWorkflow(scope.workflowObj.id);
        });
        scope.$on('refreshError', function(event, message){
          console.log(message);
          scope.setWorkflowDetailsError(message);
        });
      }
    };
  });
