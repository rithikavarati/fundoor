import Map "mo:core/Map";
import List "mo:core/List";
import Types "../types/auth";
import Nat32 "mo:core/Nat32";
import Time "mo:core/Time";

module {
  // --- Hashing ---

  // Simple deterministic hash for password storage.
  // Returns a hex-encoded hash string.
  public func hashPassword(password : Text) : Text {
    // FNV-1a-inspired deterministic hash over UTF-8 bytes using Nat32 for bitwise ops
    var h : Nat32 = 2166136261; // FNV offset basis
    for (c in password.chars()) {
      let byte = c.toNat32();
      h := (h ^ byte) *% 16777619;
    };
    // Also mix in length for extra collision resistance
    h := (h ^ Nat32.fromNat(password.size())) *% 16777619;
    // Encode as 8-char hex
    let hexChars = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
    var result = "";
    var remaining = h;
    var i = 0;
    while (i < 8) {
      let nibble = Nat32.toNat(remaining % 16);
      result := hexChars[nibble] # result;
      remaining := remaining / 16;
      i += 1;
    };
    result
  };

  // --- User CRUD ---

  public func findByEmail(
    users : Map.Map<Nat, Types.User>,
    email : Text,
  ) : ?Types.User {
    let lowerEmail = email.toLower();
    users.values().find(func(u : Types.User) : Bool {
      u.email.toLower() == lowerEmail
    })
  };

  public func register(
    users : Map.Map<Nat, Types.User>,
    counter : { var nextUserId : Nat },
    firstName : Text,
    lastName : Text,
    email : Text,
    password : Text,
  ) : Types.AuthResult {
    // Check email uniqueness
    switch (findByEmail(users, email)) {
      case (?_) { return #err "Email already registered" };
      case null {};
    };
    let newId = counter.nextUserId;
    counter.nextUserId += 1;
    let user : Types.User = {
      id = newId;
      firstName;
      lastName;
      email = email.toLower();
      passwordHash = hashPassword(password);
      createdAt = Time.now();
    };
    users.add(newId, user);
    #ok (toPublic(user))
  };

  public func login(
    users : Map.Map<Nat, Types.User>,
    email : Text,
    password : Text,
  ) : Types.AuthResult {
    switch (findByEmail(users, email)) {
      case null { #err "Invalid email or password" };
      case (?user) {
        if (user.passwordHash == hashPassword(password)) {
          #ok (toPublic(user))
        } else {
          #err "Invalid email or password"
        }
      };
    }
  };

  public func getMe(
    users : Map.Map<Nat, Types.User>,
    sessions : Map.Map<Principal, Nat>,
    caller : Principal,
  ) : Types.GetMeResult {
    switch (sessions.get(caller)) {
      case null { #err "Not logged in" };
      case (?userId) {
        switch (users.get(userId)) {
          case null { #err "User not found" };
          case (?user) { #ok (toPublic(user)) };
        };
      };
    }
  };

  public func updateUser(
    users : Map.Map<Nat, Types.User>,
    sessions : Map.Map<Principal, Nat>,
    caller : Principal,
    firstName : Text,
    lastName : Text,
    email : Text,
  ) : Types.UpdateUserResult {
    switch (sessions.get(caller)) {
      case null { #err "Not logged in" };
      case (?userId) {
        switch (users.get(userId)) {
          case null { #err "User not found" };
          case (?user) {
            let lowerEmail = email.toLower();
            if (lowerEmail != user.email) {
              switch (findByEmail(users, email)) {
                case (?_) { return #err "Email already in use" };
                case null {};
              };
            };
            let updated : Types.User = {
              user with
              firstName = firstName;
              lastName = lastName;
              email = lowerEmail;
            };
            users.add(userId, updated);
            #ok (toPublic(updated))
          };
        };
      };
    }
  };

  public func toPublic(user : Types.User) : Types.UserPublic {
    {
      id = user.id;
      firstName = user.firstName;
      lastName = user.lastName;
      email = user.email;
      createdAt = user.createdAt;
    }
  };

  // --- Password Reset ---

  // Direct single-step password reset: verify email exists, confirm passwords match, hash and save.
  public func directResetPassword(
    users : Map.Map<Nat, Types.User>,
    email : Text,
    newPassword : Text,
    confirmPassword : Text,
  ) : Types.DirectResetPasswordResult {
    if (newPassword != confirmPassword) {
      return #err "Passwords do not match";
    };
    switch (findByEmail(users, email)) {
      case null { #err "No account found with that email" };
      case (?user) {
        let updated : Types.User = {
          user with
          passwordHash = hashPassword(newPassword);
        };
        users.add(user.id, updated);
        #ok
      };
    }
  };

  // --- Favorites ---

  public func getFavorites(
    userFavorites : Map.Map<Nat, List.List<Nat>>,
    userId : Nat,
  ) : [Nat] {
    switch (userFavorites.get(userId)) {
      case null { [] };
      case (?favList) { favList.toArray() };
    }
  };

  public func addFavorite(
    userFavorites : Map.Map<Nat, List.List<Nat>>,
    userId : Nat,
    activityId : Nat,
  ) : Types.FavoriteResult {
    let favList = switch (userFavorites.get(userId)) {
      case null {
        let newList = List.empty<Nat>();
        userFavorites.add(userId, newList);
        newList
      };
      case (?existing) { existing };
    };
    // Avoid duplicates
    if (favList.values().find(func(id : Nat) : Bool { id == activityId }) == null) {
      favList.add(activityId);
    };
    #ok
  };

  public func removeFavorite(
    userFavorites : Map.Map<Nat, List.List<Nat>>,
    userId : Nat,
    activityId : Nat,
  ) : Types.FavoriteResult {
    switch (userFavorites.get(userId)) {
      case null { #ok };
      case (?favList) {
        let filtered = favList.filter(func(id : Nat) : Bool { id != activityId });
        userFavorites.add(userId, filtered);
        #ok
      };
    }
  };
};
