const {
	User
} = require('../models');
module.exports = {
	createUser: async (req, res) => {
		const { username, email, password } = req.body;
		if (!username || !email || !password ) {
			return res.status(400).json({ error: 'You must provide a username, email, and password'});
		}
		try {
			const user = await User.create({
				username,
				email,
				password,
			});
			res.json(user);
		} catch (e) {
			res.json(e);
		}
	},



//	getting users
	renderHomePage: async (req, res) => {
		res.render('homepage');
	},
	getUserById: async (req, res) => {
		req.session.save(() => {
			if (req.session.visitCount) {
				req.session.visitCount++;
			} else {
				req.session.visitCount = 1;
			}
		});
		try {
			const userData = await User.findByPk(req.params.userId);
			const user = userData.get({ plain: true });
			res.render('singleUser', {
				user,
				visitCount: req.session.visitCount,
			});
		} catch (e) {
			res.json(e);
		}
	},
	
	login: async (req, res) => {
		console.log(req.body);
		try {
			//	first find the user with the given email address
			const userData = await User.findOne({where: { email: req.body.email }});
			const userFound = userData.get({ plain: true });

			if (!userFound) {
				res.status(401).send({message: 'Invalid credentials!'});
			}
			
			// console.log(userFound);
			//	check if the password from the form is the same password as the user found
			//	with the given email
			//	if that is true, save the user found in req.session.user
			// console.log(userFound.password, 72);
			// console.log(req.body.password, 73);
			if (userFound.password !== req.body.password) {
				// console.log('im hit', 75);
				res.status(401).send({message: 'Invalid credentials!'});
			}
			req.session.save(() => {
				req.session.user = userFound;
				req.session.loggedIn = true;
				res.redirect('/blog');
			});
		} catch (e) {
			console.log(e);
			res.json(e);
		}
	},

	signupHandler: async (req, res) => {
		const { email, username, password } = req.body;

		try {
			const createdUser = await User.create({
				email,
				username, 
				password,
			});
			const user = createdUser.get({ plain: true });

			req.session.save(() => {
				req.session.loggedIn = true;
				req.session.user = user;
				res.redirect('/blog');
			});
		} catch (e) {
			res.json(e);
		}
	},

	loginView: (req, res) => {
		if (req.session.loggedIn) {
			return res.redirect('/blog');
		}
		res.render('login');
	},

	signupView: (req, res) => {
		if (req.session.loggedIn) {
			return res.redirect('/blog');
		}
		res.render('signUp');
	},

	logout: (req, res) => {
		req.session.destroy(() => {
			res.send({ status: true });
		})
	},
};