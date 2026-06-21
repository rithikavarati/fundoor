import Map "mo:core/Map";
import List "mo:core/List";
import Types "../types/common";
import AuthTypes "../types/auth";

module {
  // Old Activity type — matches the previously deployed stable state (includes eventDate fields)
  type OldActivity = {
    id : Nat;
    name : Text;
    description : Text;
    category : Text;
    location : Text;
    rating : Float;
    tags : [Text];
    imageUrl : Text;
    websiteUrl : Text;
    eventDate : ?Text;
    eventDateEnd : ?Text;
  };

  type OldActor = {
    activities : Map.Map<Nat, OldActivity>;
    users : Map.Map<Nat, AuthTypes.User>;
    userFavorites : Map.Map<Nat, List.List<Nat>>;
    authCounter : { var nextUserId : Nat };
    sessions : Map.Map<Principal, Nat>;
  };

  type NewActor = {
    activities : Map.Map<Nat, Types.Activity>;
    users : Map.Map<Nat, AuthTypes.User>;
    userFavorites : Map.Map<Nat, List.List<Nat>>;
    authCounter : { var nextUserId : Nat };
    sessions : Map.Map<Principal, Nat>;
  };

  public func run(old : OldActor) : NewActor {
    let activities = old.activities.map<Nat, OldActivity, Types.Activity>(
      func(_id, a) {
        {
          id = a.id;
          name = a.name;
          description = a.description;
          category = a.category;
          location = a.location;
          rating = a.rating;
          tags = a.tags;
          imageUrl = a.imageUrl;
          websiteUrl = a.websiteUrl;
          eventDate = null;
          eventDateEnd = null;
        }
      }
    );
    {
      activities;
      users = old.users;
      userFavorites = old.userFavorites;
      authCounter = old.authCounter;
      sessions = old.sessions;
    };
  };
};
