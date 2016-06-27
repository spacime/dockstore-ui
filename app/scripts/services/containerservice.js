'use strict';

/**
 * @ngdoc service
 * @name dockstore.ui.ContainerService
 * @description
 * # ContainerService
 * Service in the dockstore.ui.
 */
angular.module('dockstore.ui')
  .service('ContainerService', [
      '$q',
      '$http',
      'WebService',
      function ($q, $http, WebService) {

    this.getPublishedContainerList = function() {
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URI + '/containers/published'
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.getCrossSitePublishedContainerList = function() {
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: 'http://127.0.0.1:5000/test'
          // url: 'https://www.dockstore.org:8443' + '/containers/published'
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.getPublishedContainerById = function(containerId) {
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URI + '/containers/published/' + containerId
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.getPublishedContainerByPath = function(containerPath) {
      var containerPathEncoded = containerPath.replace(/\//g, '%2F');
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URI + '/containers/path/' + containerPathEncoded +
                '/published/'
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.getPublishedContainerByToolPath = function(containerPath) {
      var containerPathEncoded = containerPath.replace(/\//g, '%2F');
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URI + '/containers/path/tool/' + containerPathEncoded +
                '/published/'
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.getUserContainerList = function(userId) {
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URI + '/users/' + userId + '/containers'
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.createContainer = function(containerObj) {
      return $q(function(resolve, reject) {
        $http({
          method: 'POST',
          url: WebService.API_URI + '/containers/registerManual',
          headers: {
            'Content-Type': 'application/json'
          },
          data: containerObj
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.registerContainer = function(containerObj) {
      return $q(function(resolve, reject) {
        $http({
          method: 'POST',
          url: WebService.API_URI + '/containers/published',
          headers: {
            'Content-Type': 'application/json'
          },
          data: containerObj
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.refreshContainer = function(containerId) {
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URI + '/containers/' + containerId + '/refresh',
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.refreshUserContainers = function(userId) {
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URI + '/users/' + userId + '/containers/refresh',
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.setContainerRegistration = function(containerId, isPublished) {
      return $q(function(resolve, reject) {
        $http({
          method: 'POST',
          url: WebService.API_URI + '/containers/' + containerId + '/publish',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            publish: isPublished
          }
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.deleteContainer = function(containerId) {
      return $q(function(resolve, reject) {
        $http({
          method: 'DELETE',
          url: WebService.API_URI + '/containers/' + containerId,
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.updateContainerTag = function(containerId, tagObj) {
      return $q(function(resolve, reject) {
        $http({
          method: 'PUT',
          url: WebService.API_URI + '/containers/' + containerId + '/tags',
          headers: {
            'Content-Type': 'application/json'
          },
          data: [tagObj]
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.createContainerTag = function(containerId, tagObj) {
      return $q(function(resolve, reject) {
        $http({
          method: 'POST',
          url: WebService.API_URI + '/containers/' + containerId + '/tags',
          headers: {
            'Content-Type': 'application/json'
          },
          data: [tagObj]
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.deleteContainerTag = function(containerId, tagId) {
      return $q(function(resolve, reject) {
        $http({
          method: 'DELETE',
          url: WebService.API_URI + '/containers/' + containerId +
              '/tags/' + tagId
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.setContainerLabels = function(containerId, labels) {
      return $q(function(resolve, reject) {
        $http({
          method: 'PUT',
          url: WebService.API_URI + '/containers/' + containerId + '/labels',
          params: {
            labels: labels
          }
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.getDockerFile = function(containerId, tagName) {
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URI + '/containers/' + containerId + '/dockerfile',
          params: {
            tag: tagName
          }
        }).then(function(response) {
          resolve(response.data.content);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.getDescriptorFile = function(containerId, tagName, type) {
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URI + '/containers/' + containerId + '/' + type,
          params: {
            tag: tagName
          }
        }).then(function(response) {
          resolve(response.data.content);
        }, function(response) {
          reject(response);
        });
      });
    };

  }]);
