class inputBarDirective {
  constructor() {
    this.require = '?ngModel';
    this.restrict = 'E';
    this.templateUrl = '/templates/input.html';
    this.scope = {};
  }
  link(scope, element, attrs) {
    scope.title = attrs.title;
    scope.$watch('value', () => {
      scope.$emit('inputChange', { key: attrs.title, value: scope.value });
    });
    scope.$on('empty', (evt, data) => {
      scope.value = undefined;
      scope.change = false;
    });
  }
}

export default inputBarDirective;
