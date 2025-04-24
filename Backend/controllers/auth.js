const User = require('../models/User');
const Banned = require('../models/Banned');
exports.register = async (req,res,next)=> {
    try {
        const {name,email,tel,password,role} = req.body;
        const user = await User.create({
            name,
            email,
            tel,
            password,
            role
        });
        //Create token
        // const token = user.getSignedJwtToken();
        // res.status(200).json({success:true,token});
        sendTokenResponse(user,200,res);
    } catch(err) {
        res.status(400).json({success:false});
        console.log(err.stack);
    }
}


//@desc Login user
//@route POST /api/v1/auth/login
//@access Public
exports.login=async (req,res,next)=> {
    const {email,password} = req.body;

    //Validate email & password
    if(!email || !password) {
        return res.status(400).json({success:false,
            msg : 'Please provide an email and password'
        });
    }

    const user = await User.findOne({email}).select('+password');

    if(!user) {
        return res.status(400).json({success:false,
            msg : 'Invalid credentials'
        });
    }

    const isMatch = await user.matchPassword(password);

    if(!isMatch) {
        return res.status(401).json({success : false,
            msg : 'Invalid credentials'
        });
    }

    // const token = user.getSignedJwtToken();
    // res.status(200).json({success:true,token});
    sendTokenResponse(user,200,res);
}

const sendTokenResponse = async (user,statusCode,res)=> {
    const token = user.getSignedJwtToken();
    const checkBan = await Banned.findOne({user : user._id});
    const options = {
        expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
        httpOnly : true
    };

    if(process.env.NODE_ENV === 'production') {
        options.secure = true;
    }
    if(checkBan) {
        res.status(statusCode).cookie('token',token,options).json({
            success : true,
            token,
            username : user.name,
            email : user.email,
            role : user.role,
            msg : 'Yor are banned'
        });
    }
    else {
        res.status(statusCode).cookie('token',token,options).json({
            success : true,
            token,
            username : user.name,
            email : user.email,
            role : user.role
        });
    }
}

//@desc Get current Logged in user
//@route POST /api/v1/auth/me
//@access Private

exports.getMe = async(req,res,next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        data:user
    });
}

//@desc Log user out /clear cookie
//@route GET /api/v1/auth/logout
//@access Private
exports.logout = async (req,res,next) => {
    res.cookie('token','none', {
        expires : new Date(Date.now() + 10*1000),
        httpOnly : true
    });

    res.status(200).json({
        success : true,
        data : {}
    });
}