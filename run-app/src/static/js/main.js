var App = function() {
  this.init();
};

App.prototype.init = function() {
  this.user = null;
  this.coins = 10000;
  this.bet = {
    name: null,
    amount: null
  };
  this.initFoundation();
  this.initFirebase();
  this.initLogin();
}

App.prototype.view = {
  body: 'body',
  header: '.top-bar',
  username: '.user-name',
  useravatar: '.user-avatar',
  logout: '.log-out',
  betCtr: '.bet-container',
  bet: '#place-bet',
  betAmount: '#bet-amount',
  betPlayer: '#bet-player',
  betPlaced: '#bet-placed',
  startMatch: '#start-match',
  endMatch: '#end-match',
  winner: 'input[name="winner"]'
}

App.prototype.events = function() {
  var view = this.view;
  $(view.logout).on('click', this.logout);
  $(view.bet).on('click', this.placeBet.bind(this));
  $(view.bet).on('click', this.placeBet.bind(this));
  $(view.startMatch).on('click', this.startMatch.bind(this));
  $(view.endMatch).on('click', this.endMatch.bind(this));
}

App.prototype.initFoundation = function() {
  $(document).foundation();
}

App.prototype.initFirebase = function() {
  // Initialize Firebase

  firebase.initializeApp(config);
}

App.prototype.initLogin = function() {
  // FirebaseUI config.
  var app = this,
    uiConfig = {
    signInOptions: [
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    ],
    signInFlow: 'popup'
  };

  // Initialize the FirebaseUI Widget using Firebase.
  var ui = new firebaseui.auth.AuthUI(firebase.auth());

  // The start method will wait until the DOM is loaded.
  ui.start('#firebaseui-auth-container', uiConfig);

  var db = firebase.database();
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      app.onLogin(user);
    } else {
      app.onLogout();
    }
  }, function(error) {
    console.log('authstatechangefailed', error);
  });
}

App.prototype.logout = function() {
  var app = this;
  firebase.auth().signOut();
}

App.prototype.onLogin = function(user) {
  this.user = user; // Set user for app
  console.log(user)
  $(this.view.body).attr('data-logged-in', true);
  $(this.view.username).text(user.displayName);
  $(this.view.useravatar).attr('src', user.photoURL);
  this.events();
  return;
  // User is signed in.
  var displayName = user.displayName;
  var email = user.email;
  var emailVerified = user.emailVerified;
  var photoURL = user.photoURL;
  var uid = user.uid;
  var providerData = user.providerData;
  user.getToken().then(function(accessToken) {
    document.getElementById('sign-in-status').textContent = 'Signed in';
    document.getElementById('sign-in').textContent = 'Sign out';
    document.getElementById('account-details').textContent = JSON.stringify({
      displayName: displayName,
      email: email,
      emailVerified: emailVerified,
      photoURL: photoURL,
      uid: uid,
      accessToken: accessToken,
      providerData: providerData
    }, null, '  ');
    var node = document.createElement('IMG');
    node.src = photoURL;
    document.getElementById('account-details').appendChild(node);

    db.ref().child("users").child(uid).set({
      provider: 'facebook',
      name: displayName
    });
  });
}

App.prototype.onLogout = function() {
  // User is signed out.
  $(this.view.body).attr('data-logged-in', false);
}

App.prototype.placeBet = function() {
  $(this.view.betPlaced).text($(this.view.betAmount).val() + ' on ' + $(this.view.betPlayer).val());
  this.bet.name = $(this.view.betPlayer).val();
  this.bet.amount = $(this.view.betAmount).val();
}

App.prototype.startMatch = function() {
  $(this.view.betCtr).addClass('inactive');
}

App.prototype.endMatch = function() {
  var winner = $(this.view.winner + ':checked').val();
  $(this.view.betCtr).removeClass('inactive');
  if (this.bet.name) {
    alert('You ' + ( (winner === this.bet.name) ? 'Won ' : 'Lost ') + this.bet.amount);
  }
}

// init

esrun = new App();