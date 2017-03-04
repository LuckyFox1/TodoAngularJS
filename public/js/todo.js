import $ from '../../node_modules/jquery/dist/jquery.js'

import '../css/materialize.css';
import '../css/styles.css';
import '../../node_modules/ng-sortable/dist/ng-sortable.css';

import '../../node_modules/ng-sortable/dist/ng-sortable.js';

angular.module('todoApp', ['as.sortable'])
    .controller('TodoListController', ['$http', '$timeout', 'networking', function($http, $timeout, networking) {
        let todoList = this;
        todoList.editModal = { shown: false, task: '', index: 0, onSave: false };

        todoList.todos = [];
        networking
            .getAll()
            .then((data) => {
                todoList.todos = data;
            });

        todoList.addTodo = () => {
            networking
                .addTodo(todoList.task)
                .then((newlyCreated) => {
                    todoList.todos.push(newlyCreated);
                    todoList.task = '';
                });
        };

        todoList.toggle = (index) => {
            let todoID = todoList.todos[index]._id;

            networking
                .modifyTodo(todoID, todoList.todos[index].task, !(todoList.todos[index].completedTask))
                .then((edited) => {
                    todoList.todos[index] = edited;
                });
        };

        todoList.remove = (index) => {
            let id = todoList.todos[index]._id;

            networking
                .removeTodo(id)
                .then(() => {
                    todoList.todos.splice(index, 1);
                });
        };

        todoList.showEditModal = (index) => {
            todoList.editModal.shown = true;
            todoList.editModal.task = todoList.todos[index].task;
            todoList.editModal.index = index;

            $timeout(function () {
                $('#editField').focus();
            });
        };

        todoList.edit = (result) => {
            if(result) {
                let index = todoList.editModal.index;
                let todoID = todoList.todos[index]._id;
                todoList.todos[index].task = todoList.editModal.task;

                networking
                    .modifyTodo(todoID, todoList.todos[index].task, todoList.todos[index].completedTask)
                    .then((edited) => {
                        todoList.todos[index] = edited;
                    });
            }

            todoList.editModal.shown = false;
        };
    }])
    .factory('networking', ['$http', function($http) {
        return {
            getAll: function() {
                return $http.get('/todo', {})
                    .then((resp) => {
                        return (resp.data);
                    }, (data, status) => {
                        throw new Error("Bad request: server returned status code " + status);
                    });
            },
            addTodo: function(task) {
                return $http.post('/todo', { task:task, completedTask: false })
                    .then((data) => {
                        return data.data;
                    }, (data, status) => {
                        throw new Error("Bad request: server returned status code " + status);
                    });
            },
            modifyTodo: function(id, task, completedTask) {
                return $http.put('/todo/' + id , { task, completedTask })
                    .then((data) => {
                        return data.data;
                    }, (data, status) => {
                        throw new Error("Bad request: server returned status code " + status);
                    });
            },
            removeTodo: function(id) {
                return $http.delete('/todo/' + id, {  })
                    .then(() => {
                        return true;
                    }, (data, status) => {
                        throw new Error("Bad request: server returned status code " + status);
                    });
            }
        };
    }])
    .directive('ngEsc', [function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress keyup", function (event) {
                if(event.which === 27) {
                    scope.$apply(function (){
                        scope.$eval(attrs.ngEsc);
                    });
                    event.preventDefault();
                }
            });
        };
    }]);