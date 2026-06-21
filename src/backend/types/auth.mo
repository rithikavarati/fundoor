module {
  public type UserId = Nat;

  public type User = {
    id : UserId;
    firstName : Text;
    lastName : Text;
    email : Text;
    passwordHash : Text;
    createdAt : Int;
  };

  // Public-safe user (no passwordHash)
  public type UserPublic = {
    id : UserId;
    firstName : Text;
    lastName : Text;
    email : Text;
    createdAt : Int;
  };

  public type AuthResult = { #ok : UserPublic; #err : Text };
  public type FavoriteResult = { #ok; #err : Text };
  public type UpdateUserResult = { #ok : UserPublic; #err : Text };
  public type GetMeResult = { #ok : UserPublic; #err : Text };

  public type DirectResetPasswordResult = { #ok; #err : Text };
};
