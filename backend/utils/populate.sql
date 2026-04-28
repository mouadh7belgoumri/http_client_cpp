INSERT INTO requests(method, path, headers, body) VALUES('GET', '/api/data', '{"Content-Type": "application/json"}', '{ "key": "value" }'), ('POST', 'http://localhost:8080/api/submit', '{"Content-Type": "application/json"}', '{ "name": "John", "age": 30 }'), ('GET', 'http://jsonplaceholder.typicode.com/todos/1', '{"Content-Type": "application/json"}', '{}');


