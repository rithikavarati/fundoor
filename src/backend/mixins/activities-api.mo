import Map "mo:core/Map";
import Types "../types/common";
import ActivityLib "../lib/activities";
import Debug "mo:core/Debug";

mixin (activities : Map.Map<Nat, Types.Activity>) {
  /// Returns the full list of activities.
  public query func getActivities() : async [Types.Activity] {
    ActivityLib.listAll(activities);
  };

  /// Returns activities filtered by category.
  public query func getByCategory(category : Text) : async [Types.Activity] {
    ActivityLib.byCategory(activities, category);
  };

  /// Case-insensitive search across name, location, category, and tags.
  public query func searchActivities(searchQuery : Text) : async [Types.Activity] {
    ActivityLib.search(activities, searchQuery);
  };

  /// Returns activities for a given city and state (exact location match).
  public query func getActivitiesByCityAndState(city : Text, state : Text) : async [Types.Activity] {
    ActivityLib.byCityAndState(activities, city, state);
  };

  /// Returns activities for a given city, state, and category.
  public query func getActivitiesByCityStateAndCategory(city : Text, state : Text, category : Text) : async [Types.Activity] {
    ActivityLib.byCityStateAndCategory(activities, city, state, category);
  };

  /// Returns upcoming weekend events for a given city and state.
  /// Pass currentDate (YYYY-MM-DD) to filter to events in the next 1-2 weeks; pass null to return all.
  public query func getWeekendEventsByCityAndState(city : Text, state : Text, currentDate : ?Text) : async [Types.Activity] {
    ActivityLib.weekendEventsByCityAndState(activities, city, state, currentDate);
  };

  /// Returns a single activity by id; returns null if not found.
  public query func getActivity(id : Nat) : async ?Types.Activity {
    ActivityLib.byId(activities, id);
  };
};
