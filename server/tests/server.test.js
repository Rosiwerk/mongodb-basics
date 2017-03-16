const expect = require("expect");
const request = require("supertest");
const {ObjectID} = require("mongodb");

const {app} = require("./../server");
const {Todo} = require("./../models/todo");
const {User} = require("./../models/user");
const {todos, populateTodos, users, populateUsers} = require("./seed/seed.js");

beforeEach(populateUsers);
beforeEach(populateTodos);

describe("POST /todos", () => {
	it("should create a new todo", (done) => {
		var text = "Test todo test";

		request(app)
			.post("/todos")
			.set("x-auth", users[0].tokens[0].token)
			.send({text})
			.expect(200)
			.expect((res) => {
				expect(res.body.text).toBe(text);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.find({text}).then((todos) => {
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done();
				}).catch((e) => done(e));
			});
	});

	it("should not create todo with invalid body date", (done) => {
		var invalidText = "      ";

		request(app)
			.post("/todos")
			.set("x-auth", users[0].tokens[0].token)
			.send({invalidText})
			.expect(400)
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				
				Todo.find().then((todos) => {
					expect(todos.length).toBe(2);
					done();
				}).catch((e) => done(e));
			});
	});
});

describe("GET /todos", () => {
	it("should get all todos", (done) => {
		request(app)
			.get("/todos")
			.set("x-auth", users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body.todos.length).toBe(1);
			})
			.end(done);
	});
});

describe("GET /todo:id", () => {
	it("should return todo doc", (done) => {
		var id = todos[0]._id;

		request(app)
			.get(`/todos/${id.toHexString()}`)
			.set("x-auth", users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(todos[0].text);
			})
			.end(done);
	});

	it("should not return todo doc created by other user", (done) => {
		var id = todos[1]._id;

		request(app)
			.get(`/todos/${id.toHexString()}`)
			.set("x-auth", users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});

	it("should return 404 if todo not found", (done) => {
		var id = new ObjectID().toHexString;

		request(app)
			.get(`/todos/${id}`)
			.set("x-auth", users[0].tokens[0].token)
			.expect(404)
			.end(done)
	});

	it("should return 404 for non-object ids", (done) => {
		request(app)
			.get("todos/123")
			.set("x-auth", users[0].tokens[0].token)
			.expect(404)
			.end(done)
	});
});

describe ("DELETE /todos/:id", () => {
	it("should delete a todo doc", (done) => {
		var hexId = todos[0]._id.toHexString();

		request(app)
			.delete(`/todos/${hexId}`)
			.set("x-auth", users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo._id).toBe(hexId);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.findById(hexId).then((todo) => {
					expect(todo).toNotExist();
					done();
				}).catch((e) => done(e));
			})
	});

	it("should not delete other user's todo doc", (done) => {
		var hexId = todos[0]._id.toHexString();

		request(app)
			.delete(`/todos/${hexId}`)
			.set("x-auth", users[1].tokens[0].token)
			.expect(404)
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.findById(hexId).then((todo) => {
					expect(todo).toExist();
					done();
				}).catch((e) => done(e));
			})
	});

	it("should return 404 if todo not found", (done) => {
		var id = new ObjectID().toHexString();

		request(app)
			.delete(`/todos/${id}`)
			.set("x-auth", users[0].tokens[0].token)
			.expect(404)
			.end(done)
	});

	it("should return 404 if object id is invalid", (done) => {
		request(app)
			.delete("/todos/123")
			.set("x-auth", users[0].tokens[0].token)
			.expect(404)
			.end(done)
	});
});

describe("PATCH /todos/:id", () => {
	it("should update the todo", (done) => {
		var id = todos[0]._id.toHexString();
		var body = {
			text: "The completed todo",
			completed: true
		};

		request(app)
			.patch(`/todos/${id}`)
			.send(body)
			.set("x-auth", users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo).toInclude(body);
				expect(res.body.todo.completedAt).toBeA("number");
			})
			.end(done);
	});

	it("should not update other user's todo", (done) => {
		var id = todos[0]._id.toHexString();
		var body = {
			text: "The completed todo",
			completed: true
		};

		request(app)
			.patch(`/todos/${id}`)
			.send(body)
			.set("x-auth", users[1].tokens[0].token)
			.expect(404)
			.expect((res) => {
				expect(res.body.todo).toNotExist();
			})
			.end(done);
	});

	it("should clear completedAt when todo is not completed", (done) => {
		var id = todos[1]._id.toHexString();
		var body = {
			completed: false
		};

		request(app)
			.patch(`/todos/${id}`)
			.send(body)
			.set("x-auth", users[1].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo).toInclude(body);
				expect(res.body.todo.completed).toBe(false);
				expect(res.body.todo.completedAt).toNotExist();
			})
			.end(done);
	});
});

describe("GET /users/me", () => {
	it("should return user if authenticated", (done) => {
		request(app)
			.get("/users/me")
			.set("x-auth", users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body._id).toBe(users[0]._id.toHexString());
				expect(res.body.email).toBe(users[0].email);
			})
			.end(done);
	});

	it("should return 401 if not authenticated", (done) => {
		request(app)
			.get("/users/me")
			.expect(401)
			.expect((res) => {
				expect(res.body).toEqual({});
			})
			.end(done);
	});
});

describe("POST /users", () => {
	it("should create a user", (done) => {
		var email = "example@example.com";
		var password = "123dskjsd!";

		request(app)
			.post("/users")
			.send({email, password})
			.expect(200)
			.expect((res) => {
				expect(res.headers["x-auth"]).toExist();
				expect(res.body._id).toExist();
				expect(res.body.email).toBe(email);
			})
			.end((err) => {
				if (err) {
					return done(err);
				}

				User.findOne({email}).then((user) => {
					expect(user).toExist();
					expect(user.password).toNotBe(password);
					done();
				})
			});
	});

	it("should return validation errors if request invalid", (done) => {
		var email = "ashjashjashjas@kl.com";
		var password = "askla";

		request(app)
			.post("/users")
			.send({email, password})
			.expect(400)
			.end(done);
	});

	it("should not create user if email in use", (done) => {
		var email = "rosiwerk@gmail.com";
		var password = "abc123!"

		request(app)
			.post("/users")
			.send({email, password})
			.expect(400)
			.end(done);
	});
});

describe("POST /users/login", () => {
	it("should return x-auth token when valid email and password are send", (done) => {
		var email = users[1].email;
		var password = users[1].password;
		request(app)
			.post("/users/login")
			.send({email, password})
			.expect(200)
			.expect((res) => {
				// Bracket notation because hyphen in the name
				// of x-auth token
				expect(res.headers["x-auth"]).toExist();
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				User.findById(users[1]._id).then((user) => {
					expect(user.tokens[1]).toInclude({
						access: "auth",
						token: res.headers["x-auth"]
					});
					done();
				}).catch((e) => {
					done(e);
				});
			});
	});

	it("should return 400 if no user found for sent email and password", (done) => {
		var email = users[1].email;
		var password = users[1].password + "4545";
		request(app)
			.post("/users/login")
			.send({email, password})
			.expect(400)
			.expect((res) => {
				expect(res.headers["x-auth"]).toNotExist();
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				User.findById(users[1]._id).then((user) => {
					expect(user.tokens.length).toBe(1);
					done();
				}).catch((e) => {
					done(e);
				});
			});
	});
});

describe("DELETE /users/me/token", () => {
	it("should delete auth token on logout", (done) => {
		var token = users[0].tokens[0].token;
		request(app)
			.delete("/users/me/token")
			.set("x-auth", users[0].tokens[0].token)
			.expect(200)
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				User.findById(users[0]._id).then((user) => {
					expect(user.tokens.length).toBe(0);
					done();
				}).catch((e) => done(e));
			});
	});
});