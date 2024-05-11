const { default: mongoose } = require('mongoose');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const secretKey = 'secret_key';


// Middleware to extract and verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  //Checking if token, if theres no token it returns 401 unauthoritzed
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { exp } = decoded;


    if (Date.now() >= exp * 1000) {
      return res.status(401).json({ message: 'Token has expired' });
    }
    req.user = decoded;
    next();
  });

};


//Validate update on users request
const validateUpdateUser = (req, res, next) => {
  const { id, role } = req.body;
  //int array to store error message

  let err = [];
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  //Checking if there are any eerror and if there are status of 400 and error message

  if (err?.length != 0)
    return res.status(400).json({ error: err });

  next();
};

//Middleware for deleting user 
const validateDeleteUser = (req, res, next) => {
  const { id } = req.body;

  let err = [];
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }
  if (err?.length != 0)
    return res.status(400).json({ error: err });

  next();
};

//Error when name/email/password is not filled
const validateCreateUser = (req, res, next) => {
  const { name, email, password } = req.body;

  let err = [];
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  if (err?.length != 0)
    return res.status(400).json({ error: err });

  next();
};

const validateLoginUser = (req, res, next) => {
  const { email, password } = req.body;

  let err = [];

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  if (err?.length != 0)
    return res.status(400).json({ error: err });

  next();
};


// Sign up new user
const createUser = async (req, res) => {
  const { name, email, password, code, role, createdBy } = req.body;
  try {
    let isExist = await User.findOne({ email: email });
    if (!isExist) {
      if (code) {
        //If statement for when code has been input in the field
        let _user = await User.findOne({ $or: [{ code1: code }, { code2: code }, { code3: code }, { code4: code }, { code5: code }, { code6: code }, { code7: code }, { code8: code }, { code9: code }, { code10: code }] });
        if (_user) {
          //Creating a new acc when input field code code
          const user = await User.create({ name, email, password, child: _user?.child, role: "Family" });
          res.status(200).json(user);
        }
        else {
          res.status(400).json({ error: "Invalid parent code" });
        }
      }
      //else statement for if code has not been input
      else {
        let user = {};
        if (role && createdBy) {
          user = await User.create({ name, email, password, role, createdBy });
        }
        else {
          user = await User.create({ name, email, password });

        }
        res.status(200).json(user);
      }
    }
    else {
      res.status(400).json({ error: "Already exist user" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login user with else statement when login detail/not exisiting user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      if (user?.password == password) {

        //If statement for the user that requires password to be changed
        let changePassword = "";

        if (user?._doc?.password == user?._doc?.createdBy) {
          changePassword = "1";
        }
        delete user?._doc?.password;
        const expirationTime = Math.floor(Date.now() / 1000) + 2 * 60 * 60; // 2 hours
        const token = jwt.sign({ ...user?._doc, exp: expirationTime }, secretKey);

        res.status(200).json({ ...user?._doc, token: token, changePassword: changePassword });
      }
      else {
        res.status(400).json({ error: "Invalid credentials" });
      }
    }
    else {
      res.status(400).json({ error: "User does not exist" });
    }

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Route to get all users without their password
const UserList = async (req, res) => {
  try {
    const { name, role, email } = req.body;

    let filter = {};
    if (name) {
      filter["name"] = { $regex: new RegExp(name, "i") };
    }
    //Adding filters for role
    if (role && email) {
      filter["role"] = role;
      filter['child'] = { $ne: "" };
      filter['email'] = email;
    }

    const user = await User.find(filter).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Route for deleting a user
const deleteUser = async (req, res) => {
  const { id } = req.body;

  const _user = await User.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
  console.log(_user, id);

  if (!_user) {
    return res.status(404).json({ error: 'No User found' });
  }

  res.status(200).json(_user);
};


// Updating the users information
const updateUser = async (req, res) => {
  const { id } = req.body;

  const _user = await User.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, { ...req.body });

  if (!_user) {
    return res.status(404).json({ error: 'No User found' });
  }

  res.status(200).json(_user);
};

// Controller to fetch all parents by the child's name
const getParentsByChildName = async (req, res) => {
  const { childName } = req.params;
  try {
    const parents = await User.find({ child: childName, role: 'Parent' });
    if (!parents.length) {
      return res.status(404).json({ message: 'No parents found' });
    }
    const parentDetails = parents.map(parent => ({ parentName: parent.name, email: parent.email }));
    res.status(200).json(parentDetails);
  } catch (error) {
    console.error('Error fetching parents:', error);
    res.status(500).json({ message: 'Failed to retrieve parents', error: error.message });
  }
};

module.exports = {
  loginUser,
  createUser,
  validateCreateUser,
  validateLoginUser,
  authenticateToken,
  UserList,
  deleteUser,
  updateUser,
  validateUpdateUser,
  validateDeleteUser,
  getParentsByChildName
};
