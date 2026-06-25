const accountModel = require("../model/account.model");

// create user Account Controller
const createAccountController = async (req, res) => {
  const user = req.user;

  // create Account
  const account = await accountModel.create({
    user: user._id,
  });
  // res data
  res.status(201).json({
    account,
  });
};

// get all user Account cntroller
const getUserAccoutnController = async (req, res) => {
  // find account
  const account = await accountModel.find({ user: req.user._id });

  return res.status(200).json({
    account,
  });
};

// get Account Balance
const getAccountBalanceController = async (req, res) => {
  const { accountId } = req.params;

  // fatch account chack
  const account = await accountModel.findOne({
    _id: accountId,
    user: req.user._id
  });
  if (!account) {
    return res.status(400).json({
      message: "Accout not Found",
    });
  }

  // fathc balance
  const balance = await account.getBalance();

    res.status(200).json({
    accountId: account._id,
    balance: balance,
  });
};

module.exports = {
  createAccountController,
  getUserAccoutnController,
  getAccountBalanceController,
};
