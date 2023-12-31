"use strict";

// Data
const account1 = {
  owner: "Paulette Flores",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Larel Plant",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const welcomeMessage = document.querySelector(".welcome__message");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

//MOVEMENTS

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? `deposit` : `withdrawal`;
    const html = `
    <div class="movements">
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    }  ${type}</div>
          <div class="movements__value">${mov}</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};



const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} € `;
};




const calcDisplaySummary =  function (acc){
  const incomes = acc.movements
  .filter(move => move > 0)
  .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes} € `

  const out = acc.movements
  .filter(move => move < 0)
  .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)} € `

  const interest = acc.movements
  .filter(move => move > 0)
  .map(deposit => deposit * acc.interestRate/100)
  .filter((int, i, arr) => {
    console.log(arr);
    return int >= 1;
  })
  .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest} € `

};


// Function to compute names (take initials only)looping over the accounts array...
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  displayMovements(acc.movements);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
}

let currentAccount;
btnLogin.addEventListener('click', function (e) {
  // Prevent form from resubmitting
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
  }

  containerApp.style.opacity = 100;


  // clear input field
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();


  updateUI(currentAccount);
});


btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiveAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, receiveAccount);

  inputTransferAmount.value = inputTransferTo.value = '';

  // Making sure the account holder has enough money to transfer
  if (amount > 0 &&
    receiveAccount &&
    currentAccount.balance >= amount &&
    receiveAccount.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiveAccount.movements.push(amount);
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e){
  e.preventDefault();
  const amount = Number(inputLoanAmount.value)

  if(amount > 0 &&  currentAccount.movements.some(
    mov => mov >= amount * 0.1)){
      //add movement
      currentAccount.movements.push(amount);
      //updateUI
      updateUI(currentAccount);
    }
    //clear input field
    inputLoanAmount.value = "";
});


btnClose.addEventListener('click', function (e){
  e.preventDefault();
  if(
    inputCloseUsername.value === currentAccount.username
    && Number(inputClosePin.value) === currentAccount.pin
  ){

    const index = accounts.findIndex(acc => acc.username ===
      currentAccount.username);
      console.log(index);
      //delete account
      accounts.splice(index, 1)
      //hide UI
      containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});










/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// /////////////////////////////////////////////////

// const euroToUSD = 1.1;

// // const movementUSD = movements.map(function (mov){
// //   return mov * eurToUSD;
// // });

// const movementsUSD = movements.map(mov => mov * euroUSD);


//FILTER METHOD
// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });

// console.log(movements);
// console.log(deposits);

// const depositsFor = [];
// for (const move of movements) if (move > 0) depositsFor.push(mov);
// console.log(depositsFor);

// const withdrawal = movements.filter(mov => mov < 0);
// console.log(withdrawals);
// console.log (movements);
// //REDUCE METHOD
// const balance = movements.reduce((acc, cur) => acc + cur, 0)
// console.log(balance);

// let balance2 = 0;
// for (const mov of movements) balance2 += mov;
// console.log(balance2);


// //CHAINING METHODS

// const eurToUsd = 1.1;

// const totalDepositsUSD = movements
// .filter(mov => mov > 0)
// .map(mov => mov * eurToUsd)
// .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositsUSD)
