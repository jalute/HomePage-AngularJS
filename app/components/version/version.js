'use strict';

angular.module('VPT.version', [
  'VPT.version.interpolate-filter',
  'VPT.version.version-directive'
])

.value('version', '0.1');
