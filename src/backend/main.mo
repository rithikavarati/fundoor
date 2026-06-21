import Map "mo:core/Map";
import List "mo:core/List";
import Types "types/common";
import AuthTypes "types/auth";
import ActivitiesApi "mixins/activities-api";
import AuthApi "mixins/auth-api";
import ActivityLib "lib/activities";
import Migration "./migration";



actor {
  let activities : Map.Map<Nat, Types.Activity> = ActivityLib.buildStore();
  let users : Map.Map<Nat, AuthTypes.User> = Map.empty<Nat, AuthTypes.User>();
  let userFavorites : Map.Map<Nat, List.List<Nat>> = Map.empty<Nat, List.List<Nat>>();
  let authCounter = { var nextUserId : Nat = 0 };
  let sessions : Map.Map<Principal, Nat> = Map.empty<Principal, Nat>();

  include ActivitiesApi(activities);
  include AuthApi(users, userFavorites, authCounter, sessions);
};

