

const bcrypt = require("bcrypt");
const models = require('../../models/index');

const user = models.User;
const Address = models.Address;




// GET requests

exports.renderLogin = (req, res) => {
    const errormessage = req.session.errormessage || "";
    req.session.errormessage = null;
    res.render('user/login', { errormessage: errormessage }); // Pass the local variable, not the session variable
};
exports.renderSignup = (req, res) => {
    const errormessage = req.session.errormessage || "";
    req.session.errormessage = null;
    res.render('user/signup', { errormessage: errormessage });
};


// POST requests
exports.login = async (req, res) => {
    // console.log(req.body);
    const { email, password } = req.body;
    try {
        const User = await user.findOne({ email });
        if (!User) {
            req.session.errormessage = `User doesn't exist`;
            return res.redirect('/login');
        }
        if (User && await bcrypt.compare(password, User.password)) {
            req.session.message = `Welcome ${User.name}`;
            req.session.userId = User._id;
            return res.redirect('/homepage');
        } else {
            req.session.errormessage = `wrong password`;
            return res.redirect('/login');
        }
    } catch (error) {
        console.log("An error occurred in logging in", error);
        req.session.errormessage = `An error occurred. Please try again`;
        return res.redirect('/login');
    }
};

exports.logout = async (req,res)=>{
    await req.session.destroy((err)=>{
        if(err){
            console.log(err);
            res.status(500);
        }else{
            res.redirect("/homepage");
        }
    })
}

exports.signup = async (req, res) => {
    console.log(req.body);
    const { name, email, password, cnfrmpassword } = req.body;
    const nameRegex = /^[a-zA-Z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if (!nameRegex.test(name)) {
        req.session.errormessage = `Name should only have uppercase letters, lowercase letters, and spaces`;
        return res.redirect('/signup');
    }

    if (!emailRegex.test(email)) {
        req.session.errormessage = `Enter a valid email address`;
        return res.redirect('/signup');
    }

    if (!passwordRegex.test(password)) {
        req.session.errormessage = `Password should contain uppercase letters, lowercase letters, numbers, and must have at least 8 digits`;
        return res.redirect('/signup');
    }

    if (password !== cnfrmpassword) {
        req.session.errormessage = `Password Mismatch`;
        return res.redirect('/signup');
    }

    try {
        const checkData = await user.findOne({ $or: [{ name }, { email }] });
        if (checkData) {
            if (checkData.name === name) {
                req.session.errormessage = `Sorry, this name ${name} already exists`;
            } else if (checkData.email === email) {
                req.session.errormessage = `Sorry, this email ${email} already exists`;
            }
            return res.redirect('/signup');
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        await user.create({ name, email, password: hashedPassword });
        req.session.successmessage = `Account created successfully`;
        return res.redirect('/login'); // Redirect to login after successful signup
    } catch (error) {
        console.log("An error occurred in signing up", error);
        req.session.errormessage = `An error occurred. Please try again`;
        return res.redirect('/signup');
    }
};


