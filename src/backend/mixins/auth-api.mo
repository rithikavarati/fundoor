import Map "mo:core/Map";
import List "mo:core/List";
import AuthTypes "../types/auth";
import AuthLib "../lib/auth";

mixin (
  users : Map.Map<Nat, AuthTypes.User>,
  userFavorites : Map.Map<Nat, List.List<Nat>>,
  authCounter : { var nextUserId : Nat },
  sessions : Map.Map<Principal, Nat>,
) {

  // Register a new user with email and password.
  // Returns the public user profile on success or an error message.
  public shared ({ caller }) func register(
    firstName : Text,
    lastName : Text,
    email : Text,
    password : Text,
  ) : async AuthTypes.AuthResult {
    let result = AuthLib.register(users, authCounter, firstName, lastName, email, password);
    switch (result) {
      case (#ok userPublic) {
        // Auto-login: create a session for the new user
        sessions.add(caller, userPublic.id);
      };
      case (#err _) {};
    };
    result
  };

  // Log in with email and password.
  // On success, creates a session keyed by caller principal and returns public user.
  public shared ({ caller }) func login(
    email : Text,
    password : Text,
  ) : async AuthTypes.AuthResult {
    let result = AuthLib.login(users, email, password);
    switch (result) {
      case (#ok userPublic) {
        sessions.add(caller, userPublic.id);
      };
      case (#err _) {};
    };
    result
  };

  // Log out the caller, removing their session.
  public shared ({ caller }) func logout() : async () {
    sessions.remove(caller);
  };

  // Return the list of favorite activity IDs for the logged-in user.
  public shared query ({ caller }) func getFavorites() : async [Nat] {
    switch (sessions.get(caller)) {
      case null { [] };
      case (?userId) { AuthLib.getFavorites(userFavorites, userId) };
    }
  };

  // Add an activity to the logged-in user's favorites.
  public shared ({ caller }) func addFavorite(activityId : Nat) : async AuthTypes.FavoriteResult {
    switch (sessions.get(caller)) {
      case null { #err "Not logged in" };
      case (?userId) { AuthLib.addFavorite(userFavorites, userId, activityId) };
    }
  };

  // Return the current logged-in user's profile.
  public shared query ({ caller }) func getMe() : async AuthTypes.GetMeResult {
    AuthLib.getMe(users, sessions, caller)
  };

  // Update the current logged-in user's profile.
  public shared ({ caller }) func updateUser(
    firstName : Text,
    lastName : Text,
    email : Text,
  ) : async AuthTypes.UpdateUserResult {
    AuthLib.updateUser(users, sessions, caller, firstName, lastName, email)
  };

  // Remove an activity from the logged-in user's favorites.
  public shared ({ caller }) func removeFavorite(activityId : Nat) : async AuthTypes.FavoriteResult {
    switch (sessions.get(caller)) {
      case null { #err "Not logged in" };
      case (?userId) { AuthLib.removeFavorite(userFavorites, userId, activityId) };
    }
  };

  // Reset the user's password directly: verify email exists, confirm passwords match, update.
  public func forgotPassword(email : Text, newPassword : Text, confirmPassword : Text) : async AuthTypes.DirectResetPasswordResult {
    AuthLib.directResetPassword(users, email, newPassword, confirmPassword)
  };
};
